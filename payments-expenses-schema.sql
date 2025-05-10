-- Script para crear tablas de pagos y gastos

-- Tabla para registrar pagos de citas
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL, -- efectivo, tarjeta, transferencia, etc.
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'completed', -- completed, refunded, partial
  notes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para registrar gastos
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- alquiler, sueldos, servicios, productos, etc.
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_method TEXT NOT NULL, -- efectivo, tarjeta, transferencia, etc.
  recurring BOOLEAN DEFAULT FALSE, -- si es un gasto recurrente
  frequency TEXT, -- mensual, semanal, anual (para gastos recurrentes)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Políticas para pagos
CREATE POLICY "Usuarios pueden ver sus propios pagos" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios pagos" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios pagos" ON public.payments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios pagos" ON public.payments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para gastos
CREATE POLICY "Usuarios pueden ver sus propios gastos" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar sus propios gastos" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios gastos" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios gastos" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON public.payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON public.payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- Asegurarse de que las tablas sean accesibles para los usuarios autenticados
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.expenses TO authenticated;

-- Actualizar la tabla de citas para añadir campos relacionados con pagos
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS total_paid DECIMAL(10, 2) DEFAULT 0;

-- Trigger para actualizar el estado de pago de una cita cuando se registra un pago
CREATE OR REPLACE FUNCTION update_appointment_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  total_payments DECIMAL(10, 2);
  appointment_price DECIMAL(10, 2);
BEGIN
  -- Obtener el precio de la cita
  SELECT price INTO appointment_price FROM appointments WHERE id = NEW.appointment_id;
  
  -- Calcular el total pagado
  SELECT COALESCE(SUM(amount), 0) INTO total_payments 
  FROM payments 
  WHERE appointment_id = NEW.appointment_id AND status = 'completed';
  
  -- Actualizar el total pagado
  UPDATE appointments 
  SET total_paid = total_payments
  WHERE id = NEW.appointment_id;
  
  -- Actualizar el estado de pago
  IF total_payments >= appointment_price THEN
    UPDATE appointments 
    SET payment_status = 'paid'
    WHERE id = NEW.appointment_id;
  ELSIF total_payments > 0 THEN
    UPDATE appointments 
    SET payment_status = 'partial'
    WHERE id = NEW.appointment_id;
  ELSE
    UPDATE appointments 
    SET payment_status = 'pending'
    WHERE id = NEW.appointment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para pagos
CREATE TRIGGER update_appointment_payment_after_payment
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_appointment_payment_status();
