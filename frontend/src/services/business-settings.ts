import { supabase } from '../lib/supabase';

export interface BusinessHours {
  id?: string;
  user_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  is_open: boolean;
  open_time: string; // HH:MM format
  close_time: string; // HH:MM format
  created_at?: string;
  updated_at?: string;
}

export interface BusinessSettings {
  id?: string;
  user_id: string;
  business_name: string;
  default_appointment_duration: number; // minutes
  slot_interval: number; // minutes
  advance_booking_days: number;
  cancellation_hours: number;
  created_at?: string;
  updated_at?: string;
}

class BusinessSettingsService {
  async getBusinessHours(userId: string): Promise<BusinessHours[]> {
    try {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('user_id', userId)
        .order('day_of_week');

      if (error) throw error;

      // If no hours exist, create default hours (Monday-Friday 9-17)
      if (!data || data.length === 0) {
        return this.createDefaultBusinessHours(userId);
      }

      return data;
    } catch (error) {
      console.error('Error fetching business hours:', error);
      throw error;
    }
  }

  async createDefaultBusinessHours(userId: string): Promise<BusinessHours[]> {
    const defaultHours: Omit<BusinessHours, 'id' | 'created_at' | 'updated_at'>[] = [
      { user_id: userId, day_of_week: 0, is_open: false, open_time: '09:00', close_time: '17:00' }, // Sunday
      { user_id: userId, day_of_week: 1, is_open: true, open_time: '09:00', close_time: '17:00' },  // Monday
      { user_id: userId, day_of_week: 2, is_open: true, open_time: '09:00', close_time: '17:00' },  // Tuesday
      { user_id: userId, day_of_week: 3, is_open: true, open_time: '09:00', close_time: '17:00' },  // Wednesday
      { user_id: userId, day_of_week: 4, is_open: true, open_time: '09:00', close_time: '17:00' },  // Thursday
      { user_id: userId, day_of_week: 5, is_open: true, open_time: '09:00', close_time: '17:00' },  // Friday
      { user_id: userId, day_of_week: 6, is_open: false, open_time: '09:00', close_time: '17:00' }, // Saturday
    ];

    try {
      const { data, error } = await supabase
        .from('business_hours')
        .insert(defaultHours)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error creating default business hours:', error);
      throw error;
    }
  }

  async updateBusinessHours(hours: BusinessHours[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_hours')
        .upsert(hours, { onConflict: 'user_id,day_of_week' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating business hours:', error);
      throw error;
    }
  }

  async getBusinessSettings(userId: string): Promise<BusinessSettings | null> {
    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // If no settings exist, create default settings
      if (!data) {
        return this.createDefaultBusinessSettings(userId);
      }

      return data;
    } catch (error) {
      console.error('Error fetching business settings:', error);
      throw error;
    }
  }

  async createDefaultBusinessSettings(userId: string): Promise<BusinessSettings> {
    const defaultSettings: Omit<BusinessSettings, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      business_name: 'Mi Negocio',
      default_appointment_duration: 60, // 1 hour
      slot_interval: 30, // 30 minutes
      advance_booking_days: 30,
      cancellation_hours: 24,
    };

    try {
      const { data, error } = await supabase
        .from('business_settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating default business settings:', error);
      throw error;
    }
  }

  async updateBusinessSettings(settings: BusinessSettings): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('business_settings')
        .upsert(settings, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating business settings:', error);
      throw error;
    }
  }

  getDayName(dayOfWeek: number, language: 'es' | 'en' = 'es'): string {
    const days = {
      es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    return days[language][dayOfWeek];
  }
}

export const businessSettingsService = new BusinessSettingsService();
