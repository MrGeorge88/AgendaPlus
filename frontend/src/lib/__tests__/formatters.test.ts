import { describe, it, expect } from 'vitest';

// Formatter functions to test
const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const formatDate = (date: Date | string, format = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return dateObj.toLocaleDateString();
};

const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for 10-digit US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Format as +X (XXX) XXX-XXXX for 11-digit numbers starting with 1
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if doesn't match expected patterns
  return phone;
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + '...';
};

describe('Formatter Functions', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(10.50)).toBe('$10.50');
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(10.50, 'EUR')).toContain('10.50');
      expect(formatCurrency(10.50, 'GBP')).toContain('10.50');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000.50)).toBe('$1,000.50');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00');

    it('should format date in short format', () => {
      const result = formatDate(testDate, 'short');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format date in long format', () => {
      const result = formatDate(testDate, 'long');
      expect(result).toContain('Monday');
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15', 'short');
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
      // Note: Date parsing might vary by timezone, so we check for the month and year
      expect(result).toMatch(/Jan \d{1,2}, 2024/);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const testDate = new Date('2024-01-15T14:30:00');
      const result = formatTime(testDate);
      expect(result).toContain('2:30');
      expect(result).toContain('PM');
    });

    it('should handle AM times', () => {
      const testDate = new Date('2024-01-15T09:15:00');
      const result = formatTime(testDate);
      expect(result).toContain('9:15');
      expect(result).toContain('AM');
    });
  });

  describe('formatDuration', () => {
    it('should format minutes only', () => {
      expect(formatDuration(30)).toBe('30m');
      expect(formatDuration(45)).toBe('45m');
      expect(formatDuration(5)).toBe('5m');
    });

    it('should format hours only', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(120)).toBe('2h');
      expect(formatDuration(180)).toBe('3h');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(135)).toBe('2h 15m');
      expect(formatDuration(75)).toBe('1h 15m');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit US numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('should format 11-digit numbers with country code', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
    });

    it('should handle numbers with existing formatting', () => {
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
    });

    it('should return original for invalid formats', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('12345')).toBe('12345');
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
      expect(truncateText('Test', 5)).toBe('Test');
    });

    it('should truncate long text', () => {
      expect(truncateText('This is a very long text', 10)).toBe('This is...');
      expect(truncateText('Hello World', 8)).toBe('Hello...');
    });

    it('should handle edge cases', () => {
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('Hi', 3)).toBe('Hi');
      expect(truncateText('Test', 4)).toBe('Test');
    });
  });
});
