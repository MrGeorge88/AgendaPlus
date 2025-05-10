import { supabase } from '../lib/supabase';

export interface StaffMember {
  id: string; // Cambiado a string para UUID
  name: string;
  color: string;
  avatar: string;
  userId: string;
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
        email: staff.email,
        phone: staff.phone,
        specialty: staff.specialty
      }));
    } catch (error) {
      console.error('Error al obtener el personal:', error);
      return []; // No devolver datos de ejemplo en caso de error
    }
  },

  // Crear un nuevo miembro del personal
  createStaffMember: async (staffMember: Omit<StaffMember, 'id'>, userId: string): Promise<StaffMember | null> => {
    try {
      // Prepare the staff data
      const staffData = {
        name: staffMember.name,
        color: staffMember.color,
        avatar_url: staffMember.avatar,
        email: staffMember.email,
        phone: staffMember.phone,
        user_id: userId
      };

      // Only add specialty if it's defined
      if (staffMember.specialty) {
        Object.assign(staffData, { specialty: staffMember.specialty });
      }

      console.log('Inserting staff member with data:', staffData);

      const { data, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        color: data.color,
        avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        userId: data.user_id,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty
      };
    } catch (error) {
      console.error('Error al crear el miembro del personal:', error);
      return null;
    }
  },

  // Actualizar un miembro del personal existente
  updateStaffMember: async (staffMember: StaffMember): Promise<StaffMember | null> => {
    try {
      // Prepare the staff data
      const staffData = {
        name: staffMember.name,
        color: staffMember.color,
        avatar_url: staffMember.avatar,
        email: staffMember.email,
        phone: staffMember.phone
      };

      // Only add specialty if it's defined
      if (staffMember.specialty) {
        Object.assign(staffData, { specialty: staffMember.specialty });
      }

      console.log('Updating staff member with data:', staffData);

      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', staffMember.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        color: data.color,
        avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        userId: data.user_id,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty
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
