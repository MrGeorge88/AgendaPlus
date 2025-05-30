import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/auth-context';
import { toast } from 'sonner';

export interface WhatsAppMessage {
  id: string;
  user_id: string;
  message_id: string;
  from_phone: string;
  to_phone?: string;
  message_text: string;
  message_type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'contact' | 'appointment_request';
  status: 'unread' | 'read' | 'replied' | 'failed';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface SendMessageData {
  to: string;
  message: string;
  type?: 'text' | 'template';
  templateName?: string;
  templateVariables?: Record<string, string>;
}

export function useWhatsAppMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['whatsapp-messages', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as WhatsAppMessage[];
    },
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: SendMessageData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Mensaje enviado correctamente');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al enviar mensaje: ${error.message}`);
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('whatsapp_messages')
        .update({ status: 'read', updated_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al marcar mensaje: ${error.message}`);
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('whatsapp_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('WhatsApp message change:', payload);
          queryClient.invalidateQueries({ queryKey: ['whatsapp-messages'] });
          
          // Show notification for new inbound messages
          if (payload.eventType === 'INSERT' && payload.new.direction === 'inbound') {
            toast.info(`Nuevo mensaje de ${payload.new.from_phone}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Helper functions
  const getUnreadCount = () => {
    return messages.filter(msg => msg.status === 'unread' && msg.direction === 'inbound').length;
  };

  const getMessagesByPhone = (phone: string) => {
    return messages.filter(msg => 
      msg.from_phone === phone || msg.to_phone === phone
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getUniqueContacts = () => {
    const contacts = new Map();
    
    messages.forEach(msg => {
      const phone = msg.direction === 'inbound' ? msg.from_phone : msg.to_phone;
      if (phone && !contacts.has(phone)) {
        contacts.set(phone, {
          phone,
          lastMessage: msg,
          unreadCount: messages.filter(m => 
            m.from_phone === phone && 
            m.status === 'unread' && 
            m.direction === 'inbound'
          ).length
        });
      }
    });

    return Array.from(contacts.values()).sort((a, b) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
  };

  const sendMessage = (messageData: SendMessageData) => {
    return sendMessageMutation.mutateAsync(messageData);
  };

  const markAsRead = (messageId: string) => {
    return markAsReadMutation.mutateAsync(messageId);
  };

  const sendAppointmentConfirmation = async (
    phone: string, 
    appointmentData: {
      clientName: string;
      date: string;
      time: string;
      service: string;
    }
  ) => {
    const message = `Hola ${appointmentData.clientName}, tu cita ha sido confirmada para el ${appointmentData.date} a las ${appointmentData.time} para ${appointmentData.service}. ¡Te esperamos!`;
    
    return sendMessage({
      to: phone,
      message,
      type: 'text'
    });
  };

  return {
    messages,
    isLoading,
    error,
    refetch,
    sendMessage,
    markAsRead,
    sendAppointmentConfirmation,
    getUnreadCount,
    getMessagesByPhone,
    getUniqueContacts,
    isSending: sendMessageMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,
  };
}
