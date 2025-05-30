import { supabase } from '../lib/supabase';

export interface StaffMember {
  id: number; // ID es un número entero
  name: string;
  color: string;
  avatar: string;
  userId: string;
  // These fields are not in the database but we keep them in the frontend model
  email?: string;
  phone?: string;
  specialty?: string;
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
        return []; // No devolver datos de ejemplo
      }

      return data.map(staff => ({
        id: staff.id,
        name: staff.name,
        color: staff.color || "#4f46e5",
        avatar: staff.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random`,
        userId: staff.user_id,
        email: staff.email || '',
        phone: staff.phone || '',
        specialty: staff.specialty || ''
      }));
    } catch (error) {
      console.error('Error al obtener el personal:', error);
      return []; // No devolver datos de ejemplo en caso de error
    }
  },

  // Crear un nuevo miembro del personal
  createStaffMember: async (staffMember: Omit<StaffMember, 'id'>, userId: string): Promise<StaffMember | null> => {
    try {
      // Include all fields that exist in the database
      const staffData = {
        name: staffMember.name,
        color: staffMember.color,
        user_id: userId,
        email: staffMember.email || null,
        phone: staffMember.phone || null,
        specialty: staffMember.specialty || null
      };

      // Only add avatar_url if it exists
      if (staffMember.avatar) {
        Object.assign(staffData, { avatar_url: staffMember.avatar });
      }



      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        color: data.color || "#4f46e5",
        avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        userId: data.user_id,
        email: data.email || '',
        phone: data.phone || '',
        specialty: data.specialty || ''
      };
    } catch (error) {
      console.error('Error al crear el miembro del personal:', error);
      return null;
    }
  },

  // Actualizar un miembro del personal existente
  updateStaffMember: async (staffMember: StaffMember): Promise<StaffMember | null> => {
    try {
      // Include all fields that exist in the database
      const staffData = {
        name: staffMember.name,
        color: staffMember.color,
        email: staffMember.email || null,
        phone: staffMember.phone || null,
        specialty: staffMember.specialty || null
      };

      // Only add avatar_url if it exists
      if (staffMember.avatar) {
        Object.assign(staffData, { avatar_url: staffMember.avatar });
      }



      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', staffMember.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        color: data.color || "#4f46e5",
        avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        userId: data.user_id,
        email: data.email || '',
        phone: data.phone || '',
        specialty: data.specialty || ''
      };
    } catch (error) {
      console.error('Error al actualizar el miembro del personal:', error);
      return null;
    }
  },

  // Eliminar un miembro del personal
  deleteStaffMember: async (id: string): Promise<boolean> => {
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
