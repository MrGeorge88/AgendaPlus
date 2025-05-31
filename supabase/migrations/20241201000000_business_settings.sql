-- Create business_settings table
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL DEFAULT 'Mi Negocio',
  default_appointment_duration INTEGER NOT NULL DEFAULT 60, -- minutes
  slot_interval INTEGER NOT NULL DEFAULT 30, -- minutes
  advance_booking_days INTEGER NOT NULL DEFAULT 30,
  cancellation_hours INTEGER NOT NULL DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create business_hours table
CREATE TABLE IF NOT EXISTS business_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '17:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_of_week)
);

-- Enable RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for business_settings
CREATE POLICY "Users can view their own business settings" ON business_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business settings" ON business_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business settings" ON business_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business settings" ON business_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for business_hours
CREATE POLICY "Users can view their own business hours" ON business_hours
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business hours" ON business_hours
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business hours" ON business_hours
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business hours" ON business_hours
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_business_settings_updated_at 
  BEFORE UPDATE ON business_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_hours_updated_at 
  BEFORE UPDATE ON business_hours 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_settings_user_id ON business_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_user_id ON business_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_day_of_week ON business_hours(day_of_week);
