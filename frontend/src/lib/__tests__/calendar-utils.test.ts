import { describe, it, expect } from 'vitest';

// Calendar utility functions to test
const formatCalendarDate = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCalendarTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start && !end) return true;
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

const isPriceInRange = (price: number, min: number | null, max: number | null): boolean => {
  if (min !== null && price < min) return false;
  if (max !== null && price > max) return false;
  return true;
};

const getCalendarViewTitle = (date: Date, view: string, locale: string = 'en-US'): string => {
  switch (view) {
    case 'timeGridDay':
      return date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'timeGridWeek':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
      });
    case 'dayGridMonth':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
      });
    default:
      return date.toLocaleDateString(locale);
  }
};

const filterAppointmentsByStatus = (appointments: any[], statusFilters: string[]): any[] => {
  if (statusFilters.length === 0) return appointments;
  return appointments.filter(apt => statusFilters.includes(apt.status));
};

const filterAppointmentsByPaymentStatus = (appointments: any[], paymentFilters: string[]): any[] => {
  if (paymentFilters.length === 0) return appointments;
  return appointments.filter(apt => paymentFilters.includes(apt.paymentStatus));
};

const filterAppointmentsByStaff = (appointments: any[], staffFilters: string[]): any[] => {
  if (staffFilters.length === 0) return appointments;
  return appointments.filter(apt => staffFilters.includes(apt.staffId));
};

describe('Calendar Utilities', () => {
  describe('formatCalendarDate', () => {
    it('should format date correctly in English', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatCalendarDate(date, 'en-US');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format date correctly in Spanish', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatCalendarDate(date, 'es-ES');
      expect(result).toContain('2024');
      // Note: Spanish month names may vary by browser/system
    });
  });

  describe('formatCalendarTime', () => {
    it('should format time in 24-hour format', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatCalendarTime(date);
      expect(result).toBe('14:30');
    });

    it('should format morning time correctly', () => {
      const date = new Date('2024-01-15T09:15:00');
      const result = formatCalendarTime(date);
      expect(result).toBe('09:15');
    });
  });

  describe('isDateInRange', () => {
    const testDate = new Date('2024-01-15');
    const startDate = new Date('2024-01-10');
    const endDate = new Date('2024-01-20');

    it('should return true when no range is specified', () => {
      expect(isDateInRange(testDate, null, null)).toBe(true);
    });

    it('should return true when date is within range', () => {
      expect(isDateInRange(testDate, startDate, endDate)).toBe(true);
    });

    it('should return false when date is before start', () => {
      const earlyDate = new Date('2024-01-05');
      expect(isDateInRange(earlyDate, startDate, endDate)).toBe(false);
    });

    it('should return false when date is after end', () => {
      const lateDate = new Date('2024-01-25');
      expect(isDateInRange(lateDate, startDate, endDate)).toBe(false);
    });

    it('should handle only start date', () => {
      expect(isDateInRange(testDate, startDate, null)).toBe(true);
      const earlyDate = new Date('2024-01-05');
      expect(isDateInRange(earlyDate, startDate, null)).toBe(false);
    });

    it('should handle only end date', () => {
      expect(isDateInRange(testDate, null, endDate)).toBe(true);
      const lateDate = new Date('2024-01-25');
      expect(isDateInRange(lateDate, null, endDate)).toBe(false);
    });
  });

  describe('isPriceInRange', () => {
    it('should return true when no range is specified', () => {
      expect(isPriceInRange(50, null, null)).toBe(true);
    });

    it('should return true when price is within range', () => {
      expect(isPriceInRange(50, 30, 70)).toBe(true);
    });

    it('should return false when price is below minimum', () => {
      expect(isPriceInRange(20, 30, 70)).toBe(false);
    });

    it('should return false when price is above maximum', () => {
      expect(isPriceInRange(80, 30, 70)).toBe(false);
    });

    it('should handle only minimum price', () => {
      expect(isPriceInRange(50, 30, null)).toBe(true);
      expect(isPriceInRange(20, 30, null)).toBe(false);
    });

    it('should handle only maximum price', () => {
      expect(isPriceInRange(50, null, 70)).toBe(true);
      expect(isPriceInRange(80, null, 70)).toBe(false);
    });
  });

  describe('getCalendarViewTitle', () => {
    const testDate = new Date('2024-01-15T10:30:00');

    it('should format day view title', () => {
      const result = getCalendarViewTitle(testDate, 'timeGridDay', 'en-US');
      expect(result).toContain('Monday');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format week view title', () => {
      const result = getCalendarViewTitle(testDate, 'timeGridWeek', 'en-US');
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });

    it('should format month view title', () => {
      const result = getCalendarViewTitle(testDate, 'dayGridMonth', 'en-US');
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });
  });

  describe('filterAppointmentsByStatus', () => {
    const appointments = [
      { id: '1', status: 'confirmed', title: 'Appointment 1' },
      { id: '2', status: 'completed', title: 'Appointment 2' },
      { id: '3', status: 'cancelled', title: 'Appointment 3' },
      { id: '4', status: 'confirmed', title: 'Appointment 4' },
    ];

    it('should return all appointments when no filters', () => {
      const result = filterAppointmentsByStatus(appointments, []);
      expect(result).toHaveLength(4);
    });

    it('should filter by single status', () => {
      const result = filterAppointmentsByStatus(appointments, ['confirmed']);
      expect(result).toHaveLength(2);
      expect(result.every(apt => apt.status === 'confirmed')).toBe(true);
    });

    it('should filter by multiple statuses', () => {
      const result = filterAppointmentsByStatus(appointments, ['confirmed', 'completed']);
      expect(result).toHaveLength(3);
    });
  });

  describe('filterAppointmentsByPaymentStatus', () => {
    const appointments = [
      { id: '1', paymentStatus: 'paid', title: 'Appointment 1' },
      { id: '2', paymentStatus: 'pending', title: 'Appointment 2' },
      { id: '3', paymentStatus: 'partial', title: 'Appointment 3' },
      { id: '4', paymentStatus: 'paid', title: 'Appointment 4' },
    ];

    it('should return all appointments when no filters', () => {
      const result = filterAppointmentsByPaymentStatus(appointments, []);
      expect(result).toHaveLength(4);
    });

    it('should filter by payment status', () => {
      const result = filterAppointmentsByPaymentStatus(appointments, ['paid']);
      expect(result).toHaveLength(2);
      expect(result.every(apt => apt.paymentStatus === 'paid')).toBe(true);
    });
  });

  describe('filterAppointmentsByStaff', () => {
    const appointments = [
      { id: '1', staffId: 'staff1', title: 'Appointment 1' },
      { id: '2', staffId: 'staff2', title: 'Appointment 2' },
      { id: '3', staffId: 'staff1', title: 'Appointment 3' },
      { id: '4', staffId: 'staff3', title: 'Appointment 4' },
    ];

    it('should return all appointments when no filters', () => {
      const result = filterAppointmentsByStaff(appointments, []);
      expect(result).toHaveLength(4);
    });

    it('should filter by staff member', () => {
      const result = filterAppointmentsByStaff(appointments, ['staff1']);
      expect(result).toHaveLength(2);
      expect(result.every(apt => apt.staffId === 'staff1')).toBe(true);
    });

    it('should filter by multiple staff members', () => {
      const result = filterAppointmentsByStaff(appointments, ['staff1', 'staff2']);
      expect(result).toHaveLength(3);
    });
  });
});
