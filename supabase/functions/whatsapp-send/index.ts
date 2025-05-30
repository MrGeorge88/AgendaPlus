import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendMessageRequest {
  to: string;
  message: string;
  type?: 'text' | 'template';
  templateName?: string;
  templateVariables?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get user from JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      })
    }

    const { to, message, type = 'text', templateName, templateVariables }: SendMessageRequest = await req.json()

    if (!to || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get user's WhatsApp configuration
    const { data: config, error: configError } = await supabaseClient
      .from('whatsapp_config')
      .select('phone_number_id, access_token_encrypted, is_connected')
      .eq('user_id', user.id)
      .eq('is_connected', true)
      .single()

    if (configError || !config) {
      return new Response(JSON.stringify({ error: 'WhatsApp not configured or not connected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // For demo purposes, we'll use environment variables for tokens
    // In production, you'd decrypt the stored token
    const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const phoneNumberId = config.phone_number_id

    if (!accessToken || !phoneNumberId) {
      return new Response(JSON.stringify({ error: 'WhatsApp credentials not properly configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let messagePayload: any = {
      messaging_product: 'whatsapp',
      to: to,
      type: type
    }

    if (type === 'text') {
      messagePayload.text = { body: message }
    } else if (type === 'template' && templateName) {
      messagePayload.template = {
        name: templateName,
        language: { code: 'es' }
      }
      
      if (templateVariables && Object.keys(templateVariables).length > 0) {
        messagePayload.template.components = [{
          type: 'body',
          parameters: Object.values(templateVariables).map(value => ({
            type: 'text',
            text: value
          }))
        }]
      }
    }

    // Send message via WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload)
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API error:', result)
      return new Response(JSON.stringify({ 
        error: 'Failed to send message',
        details: result 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Store outbound message in database
    const messageId = result.messages?.[0]?.id
    if (messageId) {
      const { error: dbError } = await supabaseClient
        .from('whatsapp_messages')
        .insert({
          user_id: user.id,
          message_id: messageId,
          from_phone: phoneNumberId,
          to_phone: to,
          message_text: message,
          message_type: type,
          direction: 'outbound',
          status: 'sent',
          timestamp: new Date().toISOString()
        })

      if (dbError) {
        console.error('Error storing outbound message:', dbError)
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: messageId,
      result: result 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Send message error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

/* Example usage:

POST /functions/v1/whatsapp-send
Authorization: Bearer <user-jwt-token>
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Hola, tu cita ha sido confirmada para mañana a las 2:00 PM",
  "type": "text"
}

Or with template:

{
  "to": "+1234567890",
  "message": "",
  "type": "template",
  "templateName": "appointment_confirmation",
  "templateVariables": {
    "customer_name": "Juan",
    "appointment_date": "15 de enero",
    "appointment_time": "2:00 PM"
  }
}

*/
