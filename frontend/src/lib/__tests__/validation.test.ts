import { describe, it, expect } from 'vitest';

// Validation functions to test
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

const validatePrice = (price: string): boolean => {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum >= 0 && priceNum <= 10000;
};

const validateDuration = (duration: string): boolean => {
  const durationNum = parseInt(duration);
  return !isNaN(durationNum) && durationNum >= 5 && durationNum <= 480;
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{6,15}$/;
  return phoneRegex.test(cleaned);
};

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@domain')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
    });

    it('should reject empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired('\t\n')).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('should validate strings meeting minimum length', () => {
      expect(validateMinLength('hello', 5)).toBe(true);
      expect(validateMinLength('hello world', 5)).toBe(true);
      expect(validateMinLength('test', 3)).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      expect(validateMinLength('hi', 5)).toBe(false);
      expect(validateMinLength('', 1)).toBe(false);
      expect(validateMinLength('ab', 3)).toBe(false);
    });
  });

  describe('validateMaxLength', () => {
    it('should validate strings within maximum length', () => {
      expect(validateMaxLength('hello', 10)).toBe(true);
      expect(validateMaxLength('test', 5)).toBe(true);
      expect(validateMaxLength('', 5)).toBe(true);
    });

    it('should reject strings exceeding maximum length', () => {
      expect(validateMaxLength('hello world', 5)).toBe(false);
      expect(validateMaxLength('testing', 6)).toBe(false);
    });
  });

  describe('validatePrice', () => {
    it('should validate correct price values', () => {
      expect(validatePrice('10.50')).toBe(true);
      expect(validatePrice('0')).toBe(true);
      expect(validatePrice('100')).toBe(true);
      expect(validatePrice('9999.99')).toBe(true);
    });

    it('should reject invalid price values', () => {
      expect(validatePrice('-5')).toBe(false);
      expect(validatePrice('10001')).toBe(false);
      expect(validatePrice('invalid')).toBe(false);
      expect(validatePrice('')).toBe(false);
    });
  });

  describe('validateDuration', () => {
    it('should validate correct duration values', () => {
      expect(validateDuration('30')).toBe(true);
      expect(validateDuration('60')).toBe(true);
      expect(validateDuration('5')).toBe(true);
      expect(validateDuration('480')).toBe(true);
    });

    it('should reject invalid duration values', () => {
      expect(validateDuration('4')).toBe(false);
      expect(validateDuration('481')).toBe(false);
      expect(validateDuration('invalid')).toBe(false);
      expect(validateDuration('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+44 20 7946 0958')).toBe(true);
      expect(validatePhone('(555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('+0123456789')).toBe(false);
    });
  });
});
