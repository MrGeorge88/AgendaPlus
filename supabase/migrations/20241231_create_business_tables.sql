-- Create business_settings table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    business_email VARCHAR(255),
    business_phone VARCHAR(50),
    business_address TEXT,
    business_website VARCHAR(255),
    business_logo_url VARCHAR(500),
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(100) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(10) DEFAULT '12h',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_hours table
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
    is_open BOOLEAN DEFAULT true,
    open_time TIME,
    close_time TIME,
    break_start_time TIME,
    break_end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_settings
CREATE POLICY "Users can view their own business settings" ON public.business_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business settings" ON public.business_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business settings" ON public.business_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business settings" ON public.business_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for business_hours
CREATE POLICY "Users can view their own business hours" ON public.business_hours
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business hours" ON public.business_hours
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business hours" ON public.business_hours
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business hours" ON public.business_hours
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_settings_user_id ON public.business_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_user_id ON public.business_hours(user_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_day_of_week ON public.business_hours(day_of_week);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_business_settings_updated_at
    BEFORE UPDATE ON public.business_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_business_hours_updated_at
    BEFORE UPDATE ON public.business_hours
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default business hours (Monday to Friday, 9 AM to 5 PM)
-- This will be done by the application when a user first accesses business settings
