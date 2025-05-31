import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { businessSettingsService, BusinessHours, BusinessSettings } from '../services/business-settings';

export function useBusinessSettings() {
  const { user } = useAuth();
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBusinessSettings();
    }
  }, [user]);

  const loadBusinessSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const [hours, settings] = await Promise.all([
        businessSettingsService.getBusinessHours(user.id),
        businessSettingsService.getBusinessSettings(user.id)
      ]);
      
      setBusinessHours(hours);
      setBusinessSettings(settings);
    } catch (err) {
      console.error('Error loading business settings:', err);
      setError(err instanceof Error ? err.message : 'Error loading business settings');
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessHours = async (hours: BusinessHours[]) => {
    try {
      await businessSettingsService.updateBusinessHours(hours);
      setBusinessHours(hours);
      return true;
    } catch (err) {
      console.error('Error updating business hours:', err);
      setError(err instanceof Error ? err.message : 'Error updating business hours');
      return false;
    }
  };

  const updateBusinessSettings = async (settings: BusinessSettings) => {
    try {
      await businessSettingsService.updateBusinessSettings(settings);
      setBusinessSettings(settings);
      return true;
    } catch (err) {
      console.error('Error updating business settings:', err);
      setError(err instanceof Error ? err.message : 'Error updating business settings');
      return false;
    }
  };

  // Helper functions for calendar integration
  const getBusinessHoursForCalendar = () => {
    if (!businessHours.length) return {};

    const calendarBusinessHours: any = {};
    
    businessHours.forEach(hour => {
      if (hour.is_open) {
        const dayIndex = hour.day_of_week === 0 ? 7 : hour.day_of_week; // FullCalendar uses 1-7 (Mon-Sun)
        calendarBusinessHours[dayIndex] = {
          startTime: hour.open_time,
          endTime: hour.close_time
        };
      }
    });

    return calendarBusinessHours;
  };

  const getSlotMinTime = () => {
    if (!businessHours.length) return '08:00:00';
    
    const openHours = businessHours.filter(h => h.is_open);
    if (!openHours.length) return '08:00:00';
    
    const earliestTime = openHours.reduce((earliest, hour) => {
      return hour.open_time < earliest ? hour.open_time : earliest;
    }, openHours[0].open_time);
    
    return `${earliestTime}:00`;
  };

  const getSlotMaxTime = () => {
    if (!businessHours.length) return '20:00:00';
    
    const openHours = businessHours.filter(h => h.is_open);
    if (!openHours.length) return '20:00:00';
    
    const latestTime = openHours.reduce((latest, hour) => {
      return hour.close_time > latest ? hour.close_time : latest;
    }, openHours[0].close_time);
    
    return `${latestTime}:00`;
  };

  const getHiddenDays = () => {
    if (!businessHours.length) return [];
    
    const hiddenDays: number[] = [];
    businessHours.forEach(hour => {
      if (!hour.is_open) {
        hiddenDays.push(hour.day_of_week);
      }
    });
    
    return hiddenDays;
  };

  const isBusinessDay = (dayOfWeek: number) => {
    const hour = businessHours.find(h => h.day_of_week === dayOfWeek);
    return hour ? hour.is_open : true;
  };

  const getBusinessHoursForDay = (dayOfWeek: number) => {
    const hour = businessHours.find(h => h.day_of_week === dayOfWeek);
    return hour || null;
  };

  return {
    businessHours,
    businessSettings,
    loading,
    error,
    loadBusinessSettings,
    updateBusinessHours,
    updateBusinessSettings,
    // Calendar integration helpers
    getBusinessHoursForCalendar,
    getSlotMinTime,
    getSlotMaxTime,
    getHiddenDays,
    isBusinessDay,
    getBusinessHoursForDay
  };
}
