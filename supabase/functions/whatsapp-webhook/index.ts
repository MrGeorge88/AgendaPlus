import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: {
          name: string;
        };
        wa_id: string;
      }>;
      messages?: Array<{
        from: string;
        id: string;
        timestamp: string;
        text?: {
          body: string;
        };
        type: string;
      }>;
      statuses?: Array<{
        id: string;
        status: string;
        timestamp: string;
        recipient_id: string;
      }>;
    };
    field: string;
  }>;
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Webhook verification (GET request)
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      const verifyToken = Deno.env.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN')

      if (mode === 'subscribe' && token === verifyToken) {
        console.log('Webhook verified successfully')
        return new Response(challenge, {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
        })
      } else {
        console.log('Webhook verification failed')
        return new Response('Forbidden', {
          status: 403,
          headers: corsHeaders
        })
      }
    }

    // Handle webhook events (POST request)
    if (req.method === 'POST') {
      const payload: WhatsAppWebhookPayload = await req.json()
      
      console.log('Received webhook payload:', JSON.stringify(payload, null, 2))

      // Process each entry in the webhook
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const { value } = change
            
            // Process incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                await processIncomingMessage(supabaseClient, message, value.metadata.phone_number_id)
              }
            }

            // Process message status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                await processMessageStatus(supabaseClient, status)
              }
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processIncomingMessage(supabaseClient: any, message: any, phoneNumberId: string) {
  try {
    // Find user by phone_number_id
    const { data: config, error: configError } = await supabaseClient
      .from('whatsapp_config')
      .select('user_id, auto_reply_enabled, welcome_message')
      .eq('phone_number_id', phoneNumberId)
      .eq('is_connected', true)
      .single()

    if (configError || !config) {
      console.log('No active WhatsApp config found for phone number:', phoneNumberId)
      return
    }

    const messageText = message.text?.body || ''
    const fromPhone = message.from
    const messageId = message.id
    const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString()

    // Process the message using the database function
    const { data, error } = await supabaseClient.rpc('process_incoming_whatsapp_message', {
      p_user_id: config.user_id,
      p_message_id: messageId,
      p_from_phone: fromPhone,
      p_message_text: messageText,
      p_timestamp: timestamp
    })

    if (error) {
      console.error('Error processing message:', error)
      return
    }

    console.log('Message processed successfully:', data)

    // Send auto-reply if enabled and it's the first message from this number
    if (config.auto_reply_enabled) {
      const { data: existingMessages } = await supabaseClient
        .from('whatsapp_messages')
        .select('id')
        .eq('user_id', config.user_id)
        .eq('from_phone', fromPhone)
        .eq('direction', 'inbound')

      // If this is the first message, send welcome message
      if (existingMessages && existingMessages.length === 1) {
        await sendWelcomeMessage(fromPhone, config.welcome_message, phoneNumberId)
      }
    }

  } catch (error) {
    console.error('Error processing incoming message:', error)
  }
}

async function processMessageStatus(supabaseClient: any, status: any) {
  try {
    // Update message status in database
    const { error } = await supabaseClient
      .from('whatsapp_messages')
      .update({ 
        status: status.status,
        updated_at: new Date().toISOString()
      })
      .eq('message_id', status.id)

    if (error) {
      console.error('Error updating message status:', error)
    } else {
      console.log('Message status updated:', status.id, status.status)
    }
  } catch (error) {
    console.error('Error processing message status:', error)
  }
}

async function sendWelcomeMessage(toPhone: string, welcomeMessage: string, phoneNumberId: string) {
  try {
    const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    
    if (!accessToken) {
      console.error('WhatsApp access token not configured')
      return
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'text',
        text: { body: welcomeMessage }
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('Welcome message sent successfully:', result)
    } else {
      console.error('Failed to send welcome message:', result)
    }
  } catch (error) {
    console.error('Error sending welcome message:', error)
  }
}
