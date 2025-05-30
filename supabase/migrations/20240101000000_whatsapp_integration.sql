-- WhatsApp Integration Tables
-- This migration creates the necessary tables for WhatsApp Business API integration

-- Tabla para almacenar mensajes de WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_id TEXT UNIQUE NOT NULL,
  from_phone TEXT NOT NULL,
  to_phone TEXT,
  message_text TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video', 'location', 'contact')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'failed')),
  direction TEXT DEFAULT 'inbound' CHECK (direction IN ('inbound', 'outbound')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para solicitudes de citas desde WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_appointment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES whatsapp_messages(id) ON DELETE CASCADE,
  client_name TEXT,
  client_phone TEXT NOT NULL,
  requested_date DATE,
  requested_time TIME,
  service_name TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'expired')),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  notes TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para configuración de WhatsApp por usuario
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  phone_number_id TEXT,
  access_token_encrypted TEXT,
  webhook_verify_token TEXT,
  is_connected BOOLEAN DEFAULT FALSE,
  welcome_message TEXT DEFAULT '¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?',
  appointment_confirmation_message TEXT DEFAULT 'Tu cita ha sido confirmada para el {fecha} a las {hora}. ¡Te esperamos!',
  business_hours JSONB DEFAULT '{"monday": {"open": "09:00", "close": "18:00", "enabled": true}, "tuesday": {"open": "09:00", "close": "18:00", "enabled": true}, "wednesday": {"open": "09:00", "close": "18:00", "enabled": true}, "thursday": {"open": "09:00", "close": "18:00", "enabled": true}, "friday": {"open": "09:00", "close": "18:00", "enabled": true}, "saturday": {"open": "09:00", "close": "14:00", "enabled": true}, "sunday": {"open": "10:00", "close": "14:00", "enabled": false}}',
  auto_reply_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para plantillas de mensajes
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('welcome', 'appointment_confirmation', 'appointment_reminder', 'custom')),
  message_text TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Array de variables como ["fecha", "hora", "cliente"]
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_from_phone ON whatsapp_messages(from_phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON whatsapp_messages(status);

CREATE INDEX IF NOT EXISTS idx_whatsapp_appointment_requests_user_id ON whatsapp_appointment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_appointment_requests_status ON whatsapp_appointment_requests(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_appointment_requests_client_phone ON whatsapp_appointment_requests(client_phone);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_messages_updated_at BEFORE UPDATE ON whatsapp_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_appointment_requests_updated_at BEFORE UPDATE ON whatsapp_appointment_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_config_updated_at BEFORE UPDATE ON whatsapp_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON whatsapp_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad (RLS)
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_appointment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para whatsapp_messages
CREATE POLICY "Users can view their own WhatsApp messages" ON whatsapp_messages
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para whatsapp_appointment_requests
CREATE POLICY "Users can view their own appointment requests" ON whatsapp_appointment_requests
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para whatsapp_config
CREATE POLICY "Users can manage their own WhatsApp config" ON whatsapp_config
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para whatsapp_templates
CREATE POLICY "Users can manage their own WhatsApp templates" ON whatsapp_templates
  FOR ALL USING (auth.uid() = user_id);

-- Función para procesar mensajes entrantes y detectar solicitudes de citas
CREATE OR REPLACE FUNCTION process_incoming_whatsapp_message(
  p_user_id UUID,
  p_message_id TEXT,
  p_from_phone TEXT,
  p_message_text TEXT,
  p_timestamp TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
  v_message_uuid UUID;
  v_is_appointment_request BOOLEAN := FALSE;
  v_request_uuid UUID;
BEGIN
  -- Insertar el mensaje
  INSERT INTO whatsapp_messages (user_id, message_id, from_phone, message_text, timestamp)
  VALUES (p_user_id, p_message_id, p_from_phone, p_message_text, p_timestamp)
  RETURNING id INTO v_message_uuid;
  
  -- Detectar si es una solicitud de cita (palabras clave simples)
  IF LOWER(p_message_text) ~ '.*(cita|appointment|reserva|agendar|turno|hora).*' THEN
    v_is_appointment_request := TRUE;
    
    -- Crear solicitud de cita pendiente
    INSERT INTO whatsapp_appointment_requests (
      user_id, 
      message_id, 
      client_phone, 
      service_name,
      status
    )
    VALUES (
      p_user_id,
      v_message_uuid,
      p_from_phone,
      'Servicio por definir',
      'pending'
    )
    RETURNING id INTO v_request_uuid;
    
    -- Actualizar el tipo de mensaje
    UPDATE whatsapp_messages 
    SET message_type = 'appointment_request'
    WHERE id = v_message_uuid;
  END IF;
  
  RETURN v_message_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para confirmar una cita desde WhatsApp
CREATE OR REPLACE FUNCTION confirm_whatsapp_appointment(
  p_request_id UUID,
  p_appointment_data JSONB
)
RETURNS UUID AS $$
DECLARE
  v_appointment_id UUID;
  v_user_id UUID;
  v_client_phone TEXT;
BEGIN
  -- Obtener datos de la solicitud
  SELECT user_id, client_phone INTO v_user_id, v_client_phone
  FROM whatsapp_appointment_requests
  WHERE id = p_request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment request not found or already processed';
  END IF;
  
  -- Crear la cita en la tabla appointments
  INSERT INTO appointments (
    user_id,
    title,
    start_time,
    end_time,
    client_name,
    client_phone,
    service_id,
    status,
    price,
    notes
  )
  VALUES (
    v_user_id,
    COALESCE(p_appointment_data->>'title', 'Cita desde WhatsApp'),
    (p_appointment_data->>'start_time')::TIMESTAMPTZ,
    (p_appointment_data->>'end_time')::TIMESTAMPTZ,
    COALESCE(p_appointment_data->>'client_name', 'Cliente WhatsApp'),
    v_client_phone,
    (p_appointment_data->>'service_id')::UUID,
    'confirmed',
    COALESCE((p_appointment_data->>'price')::DECIMAL, 0),
    'Cita creada desde WhatsApp'
  )
  RETURNING id INTO v_appointment_id;
  
  -- Actualizar la solicitud
  UPDATE whatsapp_appointment_requests
  SET 
    status = 'confirmed',
    appointment_id = v_appointment_id,
    processed_at = NOW()
  WHERE id = p_request_id;
  
  RETURN v_appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
