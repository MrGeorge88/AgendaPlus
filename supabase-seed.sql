-- Datos iniciales para AgendaPlus en Supabase

-- Insertar servicios de ejemplo
INSERT INTO services (name, duration, price, cost, category, description)
VALUES 
  ('Corte de cabello', 30, 25.00, 10.00, 'Peluquería', 'Corte de cabello para hombres y mujeres'),
  ('Manicura', 45, 20.00, 8.00, 'Uñas', 'Manicura básica con esmalte'),
  ('Pedicura', 45, 25.00, 10.00, 'Uñas', 'Pedicura básica con esmalte'),
  ('Tinte', 90, 50.00, 25.00, 'Peluquería', 'Tinte de cabello completo'),
  ('Masaje relajante', 60, 40.00, 15.00, 'Masajes', 'Masaje corporal relajante');

-- Insertar profesionales de ejemplo
INSERT INTO staff (name, email, phone, color, avatar_url)
VALUES 
  ('Ana García', 'ana.garcia@example.com', '+34 612 345 678', '#4f46e5', 'https://i.pravatar.cc/150?img=1'),
  ('Carlos Rodríguez', 'carlos.rodriguez@example.com', '+34 623 456 789', '#ec4899', 'https://i.pravatar.cc/150?img=2'),
  ('Elena Martínez', 'elena.martinez@example.com', '+34 634 567 890', '#10b981', 'https://i.pravatar.cc/150?img=3');

-- Insertar clientes de ejemplo
INSERT INTO clients (name, email, phone, notes)
VALUES 
  ('Juan Pérez', 'juan@example.com', '123-456-7890', 'Cliente habitual'),
  ('María López', 'maria@example.com', '123-456-7891', 'Prefiere citas por la tarde'),
  ('Carlos Gómez', 'carlos@example.com', '123-456-7892', ''),
  ('Ana Martínez', 'ana@example.com', '123-456-7893', 'Alérgica a ciertos productos'),
  ('Pedro Sánchez', 'pedro@example.com', '123-456-7894', '');
