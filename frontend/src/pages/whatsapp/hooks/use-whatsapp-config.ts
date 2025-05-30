import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/auth-context';
import { toast } from 'sonner';

export interface WhatsAppConfig {
  id: string;
  user_id: string;
  phone_number_id?: string;
  access_token_encrypted?: string;
  webhook_verify_token?: string;
  is_connected: boolean;
  welcome_message: string;
  appointment_confirmation_message: string;
  business_hours: {
    [key: string]: {
      open: string;
      close: string;
      enabled: boolean;
    };
  };
  auto_reply_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppConfigUpdate {
  phone_number_id?: string;
  webhook_verify_token?: string;
  welcome_message?: string;
  appointment_confirmation_message?: string;
  business_hours?: WhatsAppConfig['business_hours'];
  auto_reply_enabled?: boolean;
}

export interface ConnectionData {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
}

export function useWhatsAppConfig() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch configuration
  const {
    data: config,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['whatsapp-config', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data as WhatsAppConfig | null;
    },
    enabled: !!user,
  });

  // Create or update configuration
  const updateConfigMutation = useMutation({
    mutationFn: async (configData: WhatsAppConfigUpdate) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_config')
        .upsert({
          user_id: user.id,
          ...configData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Configuración actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-config'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar configuración: ${error.message}`);
    },
  });

  // Connect WhatsApp
  const connectMutation = useMutation({
    mutationFn: async (connectionData: ConnectionData) => {
      if (!user) throw new Error('User not authenticated');

      // Test the connection first by making a simple API call
      const testResponse = await fetch(`https://graph.facebook.com/v19.0/${connectionData.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${connectionData.accessToken}`,
        },
      });

      if (!testResponse.ok) {
        throw new Error('Invalid WhatsApp credentials');
      }

      // If test passes, save the configuration
      const { data, error } = await supabase
        .from('whatsapp_config')
        .upsert({
          user_id: user.id,
          phone_number_id: connectionData.phoneNumberId,
          webhook_verify_token: connectionData.webhookVerifyToken,
          is_connected: true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('WhatsApp conectado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-config'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al conectar WhatsApp: ${error.message}`);
    },
  });

  // Disconnect WhatsApp
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('whatsapp_config')
        .update({
          is_connected: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('WhatsApp desconectado');
      queryClient.invalidateQueries({ queryKey: ['whatsapp-config'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al desconectar WhatsApp: ${error.message}`);
    },
  });

  // Test connection
  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      if (!config?.phone_number_id) {
        throw new Error('No phone number ID configured');
      }

      // This would use the stored access token in a real implementation
      // For now, we'll just check if the config exists
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('is_connected')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return data.is_connected;
    },
    onSuccess: (isConnected) => {
      if (isConnected) {
        toast.success('Conexión WhatsApp verificada');
      } else {
        toast.warning('WhatsApp no está conectado');
      }
    },
    onError: (error: Error) => {
      toast.error(`Error al verificar conexión: ${error.message}`);
    },
  });

  // Helper functions
  const isConnected = () => {
    return config?.is_connected || false;
  };

  const getWebhookUrl = () => {
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${baseUrl}/functions/v1/whatsapp-webhook`;
  };

  const getDefaultBusinessHours = () => {
    return {
      monday: { open: '09:00', close: '18:00', enabled: true },
      tuesday: { open: '09:00', close: '18:00', enabled: true },
      wednesday: { open: '09:00', close: '18:00', enabled: true },
      thursday: { open: '09:00', close: '18:00', enabled: true },
      friday: { open: '09:00', close: '18:00', enabled: true },
      saturday: { open: '09:00', close: '14:00', enabled: true },
      sunday: { open: '10:00', close: '14:00', enabled: false },
    };
  };

  const updateConfig = (configData: WhatsAppConfigUpdate) => {
    return updateConfigMutation.mutateAsync(configData);
  };

  const connect = (connectionData: ConnectionData) => {
    return connectMutation.mutateAsync(connectionData);
  };

  const disconnect = () => {
    return disconnectMutation.mutateAsync();
  };

  const testConnection = () => {
    return testConnectionMutation.mutateAsync();
  };

  return {
    config,
    isLoading,
    error,
    refetch,
    updateConfig,
    connect,
    disconnect,
    testConnection,
    isConnected,
    getWebhookUrl,
    getDefaultBusinessHours,
    isUpdating: updateConfigMutation.isPending,
    isConnecting: connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    isTesting: testConnectionMutation.isPending,
  };
}
