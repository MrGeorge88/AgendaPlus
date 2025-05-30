import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Send, TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useWhatsAppMessages } from '../hooks/use-whatsapp-messages';
import { useWhatsAppConfig } from '../hooks/use-whatsapp-config';
import { toast } from 'sonner';

interface TestResult {
  type: 'webhook' | 'send' | 'config';
  success: boolean;
  message: string;
  timestamp: Date;
}

export function WhatsAppTester() {
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('¡Hola! Este es un mensaje de prueba desde AgendaPlus.');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const { sendMessage, isSending } = useWhatsAppMessages();
  const { config, testConnection, isTesting, getWebhookUrl } = useWhatsAppConfig();

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  const testWebhookConnectivity = async () => {
    try {
      const webhookUrl = getWebhookUrl();
      const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.challenge=test_challenge&hub.verify_token=${config?.webhook_verify_token || 'test'}`;
      
      const response = await fetch(testUrl);
      const success = response.ok && await response.text() === 'test_challenge';
      
      addTestResult({
        type: 'webhook',
        success,
        message: success 
          ? 'Webhook responde correctamente' 
          : `Webhook falló: ${response.status} ${response.statusText}`,
        timestamp: new Date()
      });
      
      return success;
    } catch (error) {
      addTestResult({
        type: 'webhook',
        success: false,
        message: `Error de conectividad: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date()
      });
      return false;
    }
  };

  const testConfigurationValidity = async () => {
    try {
      const isValid = config?.is_connected && config?.phone_number_id;
      
      addTestResult({
        type: 'config',
        success: !!isValid,
        message: isValid 
          ? 'Configuración válida' 
          : 'Configuración incompleta o no conectada',
        timestamp: new Date()
      });
      
      return !!isValid;
    } catch (error) {
      addTestResult({
        type: 'config',
        success: false,
        message: `Error al validar configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date()
      });
      return false;
    }
  };

  const testMessageSending = async () => {
    if (!testPhone || !testMessage) {
      addTestResult({
        type: 'send',
        success: false,
        message: 'Número de teléfono y mensaje son requeridos',
        timestamp: new Date()
      });
      return false;
    }

    try {
      await sendMessage({
        to: testPhone,
        message: testMessage,
        type: 'text'
      });
      
      addTestResult({
        type: 'send',
        success: true,
        message: `Mensaje enviado exitosamente a ${testPhone}`,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      addTestResult({
        type: 'send',
        success: false,
        message: `Error al enviar mensaje: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date()
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      // Test 1: Configuración
      const configValid = await testConfigurationValidity();
      
      // Test 2: Webhook
      const webhookWorking = await testWebhookConnectivity();
      
      // Test 3: Envío de mensaje (solo si hay configuración válida)
      let messageSent = false;
      if (configValid && testPhone && testMessage) {
        messageSent = await testMessageSending();
      }
      
      // Resumen
      const allPassed = configValid && webhookWorking && (messageSent || !testPhone);
      
      if (allPassed) {
        toast.success('¡Todos los tests pasaron exitosamente!');
      } else {
        toast.warning('Algunos tests fallaron. Revisa los resultados.');
      }
      
    } catch (error) {
      toast.error('Error durante las pruebas');
    } finally {
      setIsRunningTests(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Testing de WhatsApp
            </h3>
            <p className="text-sm text-gray-600">
              Prueba la conectividad y funcionalidad de WhatsApp Business API
            </p>
          </div>
          <Badge variant={config?.is_connected ? 'default' : 'secondary'}>
            {config?.is_connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Prueba
              </label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Incluye código de país (ej: +52, +1, +34)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Webhook URL
              </label>
              <Input
                value={getWebhookUrl()}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mensaje de Prueba
            </label>
            <Textarea
              rows={3}
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Escribe un mensaje de prueba..."
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={runAllTests}
              disabled={isRunningTests || !config?.is_connected}
              className="flex-1"
            >
              {isRunningTests ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              {isRunningTests ? 'Ejecutando Tests...' : 'Ejecutar Todos los Tests'}
            </Button>
            
            <Button 
              onClick={testMessageSending}
              disabled={isSending || !testPhone || !testMessage}
              variant="outline"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Enviar Mensaje
            </Button>
          </div>
        </div>
      </Card>

      {/* Test Results */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Resultados de Tests</h3>
          {testResults.length > 0 && (
            <Button onClick={clearResults} variant="ghost" size="sm">
              Limpiar
            </Button>
          )}
        </div>

        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay resultados de tests aún</p>
            <p className="text-sm">Ejecuta los tests para ver los resultados aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {result.type === 'webhook' && 'Webhook'}
                      {result.type === 'send' && 'Envío'}
                      {result.type === 'config' && 'Configuración'}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={testConfigurationValidity}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <CheckCircle className="h-6 w-6" />
            <span className="font-medium">Test Configuración</span>
            <span className="text-xs text-gray-500">Verificar setup</span>
          </Button>
          
          <Button 
            onClick={testWebhookConnectivity}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <TestTube className="h-6 w-6" />
            <span className="font-medium">Test Webhook</span>
            <span className="text-xs text-gray-500">Verificar conectividad</span>
          </Button>
          
          <Button 
            onClick={() => window.open('https://developers.facebook.com/tools/webhooks/', '_blank')}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Send className="h-6 w-6" />
            <span className="font-medium">Meta Webhooks Tool</span>
            <span className="text-xs text-gray-500">Herramienta oficial</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
