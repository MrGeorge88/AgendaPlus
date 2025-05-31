-- Add color field to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#3B82F6';

-- Update existing services with default colors
UPDATE services SET color = '#3B82F6' WHERE color IS NULL;

-- Create a function to assign random colors to services
CREATE OR REPLACE FUNCTION assign_service_colors()
RETURNS void AS $$
DECLARE
    service_record RECORD;
    colors TEXT[] := ARRAY['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];
    color_index INTEGER := 1;
BEGIN
    FOR service_record IN SELECT id FROM services WHERE color = '#3B82F6' ORDER BY created_at LOOP
        UPDATE services 
        SET color = colors[color_index] 
        WHERE id = service_record.id;
        
        color_index := color_index + 1;
        IF color_index > array_length(colors, 1) THEN
            color_index := 1;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to assign colors
SELECT assign_service_colors();

-- Drop the function as it's no longer needed
DROP FUNCTION assign_service_colors();
