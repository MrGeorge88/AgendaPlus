import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client (commented out until we have actual credentials)
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AgendaPlus API' });
});

// Staff routes
app.get('/api/staff', (req, res) => {
  // Mock data for staff
  const staff = [
    { id: 1, name: "Ana García", color: "#4f46e5", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Carlos Rodríguez", color: "#ec4899", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Elena Martínez", color: "#10b981", avatar: "https://i.pravatar.cc/150?img=3" },
  ];
  
  res.json(staff);
});

// Appointments routes
app.get('/api/appointments', (req, res) => {
  // Mock data for appointments
  const appointments = [
    {
      id: "1",
      title: "Corte de cabello",
      start: "2023-05-01T10:00:00",
      end: "2023-05-01T11:00:00",
      resourceId: 1,
      backgroundColor: "#4f46e5",
      borderColor: "#4f46e5",
      extendedProps: {
        client: "Juan Pérez",
        service: "Corte de cabello",
        price: 25,
        status: "confirmed",
      },
    },
    {
      id: "2",
      title: "Manicura",
      start: "2023-05-01T11:30:00",
      end: "2023-05-01T12:30:00",
      resourceId: 2,
      backgroundColor: "#ec4899",
      borderColor: "#ec4899",
      extendedProps: {
        client: "María López",
        service: "Manicura",
        price: 20,
        status: "confirmed",
      },
    },
  ];
  
  res.json(appointments);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
