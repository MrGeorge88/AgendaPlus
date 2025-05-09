import { supabase } from '../lib/supabase';

export interface StaffMember {
  id: number;
  name: string;
  color: string;
  avatar: string;
  userId: string;
}

export const staffService = {
  // Obtener todos los miembros del personal
  getStaffMembers: async (userId: string): Promise<StaffMember[]> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!data || data.length === 0) {
        // Si no hay datos, devolver datos de ejemplo
        return [
          { id: 1, name: "Ana García", color: "#4f46e5", avatar: "https://i.pravatar.cc/150?img=1", userId },
          { id: 2, name: "Carlos Rodríguez", color: "#ec4899", avatar: "https://i.pravatar.cc/150?img=2", userId },
          { id: 3, name: "Elena Martínez", color: "#10b981", avatar: "https://i.pravatar.cc/150?img=3", userId },
        ];
      }

      return data.map(staff => ({
        id: staff.id,
        name: staff.name,
        color: staff.color,
        avatar: staff.avatar_url || `https://i.pravatar.cc/150?img=${staff.id}`,
        userId: staff.user_id
      }));
    } catch (error) {
      console.error('Error al obtener el personal:', error);
      
      // En caso de error, devolver datos de ejemplo
      return [
        { id: 1, name: "Ana García", color: "#4f46e5", avatar: "https://i.pravatar.cc/150?img=1", userId },
        { id: 2, name: "Carlos Rodríguez", color: "#ec4899", avatar: "https://i.pravatar.cc/150?img=2", userId },
        { id: 3, name: "Elena Martínez", color: "#10b981", avatar: "https://i.pravatar.cc/150?img=3", userId },
      ];
    }
  },

  // Crear un nuevo miembro del personal
  createStaffMember: async (staffMember: Omit<StaffMember, 'id'>, userId: string): Promise<StaffMember | null> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert({
          name: staffMember.name,
          color: staffMember.color,
          avatar_url: staffMember.avatar,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        color: data.color,
        avatar: data.avatar_url || `https://i.pravatar.cc/150?img=${data.id}`,
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error al crear el miembro del personal:', error);
      return null;
    }
  },

  // Actualizar un miembro del personal existente
  updateStaffMember: async (staffMember: StaffMember): Promise<StaffMember | null> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          name: staffMember.name,
          color: staffMember.color,
          avatar_url: staffMember.avatar
        })
        .eq('id', staffMember.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        color: data.color,
        avatar: data.avatar_url || `https://i.pravatar.cc/150?img=${data.id}`,
        userId: data.user_id
      };
    } catch (error) {
      console.error('Error al actualizar el miembro del personal:', error);
      return null;
    }
  },

  // Eliminar un miembro del personal
  deleteStaffMember: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error al eliminar el miembro del personal:', error);
      return false;
    }
  }
};
