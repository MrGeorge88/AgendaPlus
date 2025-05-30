import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MessageCircle, Settings, Inbox, Calendar, CheckCircle, AlertCircle, Clock, Send, Copy } from 'lucide-react';
import { useSimpleTranslation } from '../../lib/translations';
import { Layout } from '../../components/layout/layout';
import { useWhatsAppConfig } from './hooks/use-whatsapp-config';
import { useWhatsAppMessages } from './hooks/use-whatsapp-messages';
import { useAppointmentRequests } from './hooks/use-appointment-requests';
import { WhatsAppTester } from './components/whatsapp-tester';
import { toast } from 'sonner';

export function WhatsAppIntegration() {
  const { t, language } = useSimpleTranslation();
  const [activeTab, setActiveTab] = useState<'config' | 'messages' | 'appointments' | 'testing'>('config');

  // Configuration state
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [webhookVerifyToken, setWebhookVerifyToken] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Hooks
  const {
    config,
    isLoading: configLoading,
    connect,
    disconnect,
    updateConfig,
    isConnected,
    getWebhookUrl,
    isConnecting,
    isDisconnecting,
    isUpdating
  } = useWhatsAppConfig();

  const {
    messages,
    isLoading: messagesLoading,
    sendMessage,
    markAsRead,
    sendAppointmentConfirmation,
    getUnreadCount,
    getUniqueContacts,
    isSending
  } = useWhatsAppMessages();

  const {
    requests: appointmentRequests,
    isLoading: requestsLoading,
    confirmRequest,
    rejectRequest,
    getPendingCount,
    isConfirming,
    isRejecting
  } = useAppointmentRequests();

  // Initialize form values when config loads
  useEffect(() => {
    if (config) {
      setPhoneNumberId(config.phone_number_id || '');
      setWelcomeMessage(config.welcome_message || '');
      setConfirmationMessage(config.appointment_confirmation_message || '');
    }
  }, [config]);

  const handleConnect = async () => {
    if (!phoneNumberId || !accessToken || !webhookVerifyToken) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      await connect({
        phoneNumberId,
        accessToken,
        webhookVerifyToken
      });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleUpdateMessages = async () => {
    try {
      await updateConfig({
        welcome_message: welcomeMessage,
        appointment_confirmation_message: confirmationMessage
      });
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleAppointmentAction = async (requestId: string, action: 'confirm' | 'reject') => {
    try {
      if (action === 'confirm') {
        // For demo purposes, create a basic appointment
        const request = appointmentRequests.find(r => r.id === requestId);
        if (request) {
          const startTime = new Date();
          startTime.setDate(startTime.getDate() + 1); // Tomorrow
          startTime.setHours(14, 0, 0, 0); // 2 PM

          const endTime = new Date(startTime);
          endTime.setHours(15, 0, 0, 0); // 3 PM

          await confirmRequest(requestId, {
            title: request.service_name || 'Cita desde WhatsApp',
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            client_name: request.client_name || 'Cliente WhatsApp',
            price: 50
          });

          // Send confirmation message
          if (request.client_phone) {
            await sendAppointmentConfirmation(request.client_phone, {
              clientName: request.client_name || 'Cliente',
              date: startTime.toLocaleDateString(),
              time: startTime.toLocaleTimeString(),
              service: request.service_name || 'Servicio'
            });
          }
        }
      } else {
        await rejectRequest(requestId, 'Solicitud rechazada por el usuario');
      }
    } catch (error) {
      console.error('Appointment action error:', error);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(getWebhookUrl());
    toast.success('URL del webhook copiada al portapapeles');
  };

  const renderConfigTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Estado de Conexión</h3>
            <p className="text-sm text-gray-600">
              {isConnected() ? 'Conectado a WhatsApp Business' : 'No conectado'}
            </p>
          </div>
          <Badge variant={isConnected() ? 'default' : 'secondary'}>
            {isConnected() ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>

        <div className="space-y-4">
          {!isConnected() ? (
            <div>
              <h4 className="font-medium mb-2">Configurar WhatsApp Business API</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number ID</label>
                  <input
                    type="text"
                    placeholder="Ingresa tu Phone Number ID"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Token de Acceso</label>
                  <input
                    type="password"
                    placeholder="Ingresa tu token de WhatsApp Business"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Webhook Verify Token</label>
                  <input
                    type="text"
                    placeholder="Token para verificar webhook"
                    value={webhookVerifyToken}
                    onChange={(e) => setWebhookVerifyToken(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Webhook URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={getWebhookUrl()}
                      readOnly
                      className="flex-1 p-2 border rounded-md bg-gray-50"
                    />
                    <Button onClick={copyWebhookUrl} variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Usa esta URL en la configuración de webhooks de Meta
                  </p>
                </div>
                <Button
                  onClick={handleConnect}
                  className="w-full"
                  disabled={isConnecting}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Conectando...' : 'Conectar WhatsApp'}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>WhatsApp Business conectado exitosamente</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Phone Number ID:</strong> {config?.phone_number_id}</p>
                <p><strong>Webhook URL:</strong> {getWebhookUrl()}</p>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                disabled={isDisconnecting}
              >
                {isDisconnecting ? 'Desconectando...' : 'Desconectar'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Configuración de Mensajes</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mensaje de Bienvenida</label>
            <textarea
              rows={3}
              placeholder="¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mensaje de Confirmación de Cita</label>
            <textarea
              rows={3}
              placeholder="Tu cita ha sido confirmada para el {fecha} a las {hora}. ¡Te esperamos!"
              value={confirmationMessage}
              onChange={(e) => setConfirmationMessage(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Variables disponibles: {'{fecha}'}, {'{hora}'}, {'{cliente}'}, {'{servicio}'}
            </p>
          </div>
          <Button
            onClick={handleUpdateMessages}
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderMessagesTab = () => {
    if (messagesLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando mensajes...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bandeja de Mensajes</h3>
            <Badge variant="secondary">
              {getUnreadCount()} no leídos
            </Badge>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay mensajes aún</p>
              <p className="text-sm">Los mensajes de WhatsApp aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg ${
                    message.status === 'unread' && message.direction === 'inbound'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {message.direction === 'inbound' ? message.from_phone : 'Tú'}
                      </span>
                      {message.direction === 'outbound' && (
                        <Badge variant="outline" className="text-xs">
                          <Send className="h-3 w-3 mr-1" />
                          Enviado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={message.message_type === 'appointment_request' ? 'default' : 'secondary'}>
                        {message.message_type === 'appointment_request' ? 'Solicitud de Cita' : 'Mensaje'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{message.message_text}</p>

                  {message.direction === 'inbound' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // TODO: Implement reply functionality
                          toast.info('Función de respuesta en desarrollo');
                        }}
                      >
                        Responder
                      </Button>
                      {message.status === 'unread' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(message.id)}
                        >
                          Marcar como leído
                        </Button>
                      )}
                      {message.message_type === 'appointment_request' && (
                        <Button size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Ver Solicitud
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  const renderAppointmentsTab = () => {
    if (requestsLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando solicitudes...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Solicitudes de Citas</h3>
            <Badge variant="secondary">
              {getPendingCount()} pendientes
            </Badge>
          </div>

          {appointmentRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay solicitudes de citas</p>
              <p className="text-sm">Las solicitudes desde WhatsApp aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointmentRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">
                        {request.client_name || 'Cliente sin nombre'}
                      </h4>
                      <p className="text-sm text-gray-600">{request.client_phone}</p>
                    </div>
                    <Badge
                      variant={
                        request.status === 'confirmed'
                          ? 'default'
                          : request.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                      {request.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {request.status === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {request.status === 'pending' ? 'Pendiente' :
                       request.status === 'confirmed' ? 'Confirmada' : 'Rechazada'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">Fecha:</span> {
                        request.requested_date
                          ? new Date(request.requested_date).toLocaleDateString()
                          : 'No especificada'
                      }
                    </div>
                    <div>
                      <span className="text-gray-600">Hora:</span> {
                        request.requested_time || 'No especificada'
                      }
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Servicio:</span> {
                        request.service_name || 'Por definir'
                      }
                    </div>
                    {request.notes && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Notas:</span> {request.notes}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    Recibida: {new Date(request.created_at).toLocaleString()}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAppointmentAction(request.id, 'confirm')}
                        disabled={isConfirming}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isConfirming ? 'Confirmando...' : 'Confirmar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAppointmentAction(request.id, 'reject')}
                        disabled={isRejecting}
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {isRejecting ? 'Rechazando...' : 'Rechazar'}
                      </Button>
                    </div>
                  )}

                  {request.status === 'confirmed' && request.appointment_id && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                      ✓ Cita creada en el calendario
                    </div>
                  )}

                  {request.status === 'rejected' && (
                    <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                      ✗ Solicitud rechazada
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Integración WhatsApp</h1>
            <p className="text-gray-600">
              Gestiona mensajes y citas desde WhatsApp Business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">
              {isConnected() ? 'Conectado' : 'No conectado'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('config')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'config'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Configuración
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Inbox className="h-4 w-4 inline mr-2" />
              Mensajes ({getUnreadCount()})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Citas ({getPendingCount()})
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'testing'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Testing
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'config' && renderConfigTab()}
        {activeTab === 'messages' && renderMessagesTab()}
        {activeTab === 'appointments' && renderAppointmentsTab()}
        {activeTab === 'testing' && <WhatsAppTester />}
      </div>
    </Layout>
  );
}
