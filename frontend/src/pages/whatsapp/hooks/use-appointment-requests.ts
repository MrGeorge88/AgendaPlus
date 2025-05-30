import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/auth-context';
import { toast } from 'sonner';

export interface AppointmentRequest {
  id: string;
  user_id: string;
  message_id: string;
  client_name?: string;
  client_phone: string;
  requested_date?: string;
  requested_time?: string;
  service_name?: string;
  service_id?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'expired';
  appointment_id?: string;
  notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConfirmAppointmentData {
  title: string;
  start_time: string;
  end_time: string;
  client_name: string;
  service_id?: string;
  price?: number;
}

export function useAppointmentRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch appointment requests
  const {
    data: requests = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['whatsapp-appointment-requests', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_appointment_requests')
        .select(`
          *,
          whatsapp_messages!inner(
            message_text,
            from_phone,
            timestamp
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AppointmentRequest[];
    },
    enabled: !!user,
  });

  // Confirm appointment request
  const confirmRequestMutation = useMutation({
    mutationFn: async ({ requestId, appointmentData }: { 
      requestId: string; 
      appointmentData: ConfirmAppointmentData 
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Use the database function to confirm the appointment
      const { data, error } = await supabase.rpc('confirm_whatsapp_appointment', {
        p_request_id: requestId,
        p_appointment_data: appointmentData
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Cita confirmada correctamente');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-appointment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al confirmar cita: ${error.message}`);
    },
  });

  // Reject appointment request
  const rejectRequestMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_appointment_requests')
        .update({
          status: 'rejected',
          notes: reason,
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Solicitud rechazada');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-appointment-requests'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al rechazar solicitud: ${error.message}`);
    },
  });

  // Update appointment request
  const updateRequestMutation = useMutation({
    mutationFn: async ({ 
      requestId, 
      updates 
    }: { 
      requestId: string; 
      updates: Partial<AppointmentRequest> 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_appointment_requests')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Solicitud actualizada');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-appointment-requests'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar solicitud: ${error.message}`);
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('appointment_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_appointment_requests',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Appointment request change:', payload);
          queryClient.invalidateQueries({ queryKey: ['whatsapp-appointment-requests'] });
          
          // Show notification for new requests
          if (payload.eventType === 'INSERT') {
            toast.info('Nueva solicitud de cita desde WhatsApp');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Helper functions
  const getPendingCount = () => {
    return requests.filter(req => req.status === 'pending').length;
  };

  const getRequestsByStatus = (status: AppointmentRequest['status']) => {
    return requests.filter(req => req.status === status);
  };

  const getRequestsByPhone = (phone: string) => {
    return requests.filter(req => req.client_phone === phone);
  };

  const confirmRequest = (requestId: string, appointmentData: ConfirmAppointmentData) => {
    return confirmRequestMutation.mutateAsync({ requestId, appointmentData });
  };

  const rejectRequest = (requestId: string, reason?: string) => {
    return rejectRequestMutation.mutateAsync({ requestId, reason });
  };

  const updateRequest = (requestId: string, updates: Partial<AppointmentRequest>) => {
    return updateRequestMutation.mutateAsync({ requestId, updates });
  };

  // Auto-expire old pending requests (older than 24 hours)
  const expireOldRequests = async () => {
    if (!user) return;

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { error } = await supabase
      .from('whatsapp_appointment_requests')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .lt('created_at', oneDayAgo.toISOString());

    if (error) {
      console.error('Error expiring old requests:', error);
    } else {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-appointment-requests'] });
    }
  };

  return {
    requests,
    isLoading,
    error,
    refetch,
    confirmRequest,
    rejectRequest,
    updateRequest,
    expireOldRequests,
    getPendingCount,
    getRequestsByStatus,
    getRequestsByPhone,
    isConfirming: confirmRequestMutation.isPending,
    isRejecting: rejectRequestMutation.isPending,
    isUpdating: updateRequestMutation.isPending,
  };
}
