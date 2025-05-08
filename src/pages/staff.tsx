import { useState } from "react";
import { Layout } from "../components/layout/layout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

// Mock data for staff members
const mockStaff = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.garcia@example.com",
    phone: "+34 612 345 678",
    role: "Estilista",
    color: "#4f46e5",
    avatar: "https://i.pravatar.cc/150?img=1",
    appointmentsCount: 120,
    revenue: 3000,
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    phone: "+34 623 456 789",
    role: "Manicurista",
    color: "#ec4899",
    avatar: "https://i.pravatar.cc/150?img=2",
    appointmentsCount: 85,
    revenue: 1700,
  },
  {
    id: 3,
    name: "Elena Martínez",
    email: "elena.martinez@example.com",
    phone: "+34 634 567 890",
    role: "Masajista",
    color: "#10b981",
    avatar: "https://i.pravatar.cc/150?img=3",
    appointmentsCount: 95,
    revenue: 5700,
  },
];

export function Staff() {
  const [staff, setStaff] = useState(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStaff = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este profesional?")) {
      setStaff((prev) => prev.filter((member) => member.id !== id));
    }
  };

  return (
    <Layout title="Profesionales">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar profesionales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Nuevo profesional
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2" style={{ ringColor: member.color }}>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback style={{ backgroundColor: member.color, color: "white" }}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Email:</span>
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Teléfono:</span>
                  <span className="text-sm">{member.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Citas:</span>
                  <span className="text-sm">{member.appointmentsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Ingresos:</span>
                  <span className="text-sm">{member.revenue}€</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" /> Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDeleteStaff(member.id)}
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
