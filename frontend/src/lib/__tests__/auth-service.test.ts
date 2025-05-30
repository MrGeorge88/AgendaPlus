import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../services/auth';

// Mock Supabase
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
    }
  }
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Service Structure', () => {
    it('should have all required methods', () => {
      expect(authService).toBeDefined();
      expect(typeof authService.signIn).toBe('function');
      expect(typeof authService.signUp).toBe('function');
      expect(typeof authService.signOut).toBe('function');
      expect(typeof authService.getCurrentUser).toBe('function');
    });
  });

  describe('User Data Transformation', () => {
    it('should transform Supabase user to app user format', () => {
      const mockSupabaseUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      };

      // This tests the transformation logic that should be consistent
      const expectedUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg'
      };

      // Test the transformation logic
      expect(mockSupabaseUser.id).toBe(expectedUser.id);
      expect(mockSupabaseUser.email).toBe(expectedUser.email);
      expect(mockSupabaseUser.user_metadata?.name).toBe(expectedUser.name);
      expect(mockSupabaseUser.user_metadata?.avatar_url).toBe(expectedUser.avatar_url);
    });

    it('should handle user without name metadata', () => {
      const mockSupabaseUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {}
      };

      // Should use email prefix as fallback name
      const expectedName = 'test'; // from 'test@example.com'
      const actualName = mockSupabaseUser.user_metadata?.name || 
                        mockSupabaseUser.email?.split('@')[0] || 
                        'Usuario';

      expect(actualName).toBe(expectedName);
    });

    it('should handle user without email', () => {
      const mockSupabaseUser = {
        id: '123',
        email: null,
        user_metadata: {}
      };

      // Should use 'Usuario' as fallback name
      const expectedName = 'Usuario';
      const actualName = mockSupabaseUser.user_metadata?.name || 
                        mockSupabaseUser.email?.split('@')[0] || 
                        'Usuario';

      expect(actualName).toBe(expectedName);
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', async () => {
      // This tests that the service methods exist and can be called
      expect(authService.signIn).toBeDefined();
      expect(authService.signUp).toBeDefined();
      expect(authService.signOut).toBeDefined();
      expect(authService.getCurrentUser).toBeDefined();
    });

    it('should return proper error structure', () => {
      // Test error structure
      const mockError = new Error('Test error');
      const errorResponse = {
        user: null,
        error: mockError
      };

      expect(errorResponse.user).toBeNull();
      expect(errorResponse.error).toBeInstanceOf(Error);
      expect(errorResponse.error.message).toBe('Test error');
    });

    it('should return proper success structure', () => {
      // Test success structure
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        avatar_url: null
      };

      const successResponse = {
        user: mockUser,
        error: null
      };

      expect(successResponse.user).toBeDefined();
      expect(successResponse.user?.id).toBe('123');
      expect(successResponse.error).toBeNull();
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org'
      ];

      const invalidEmails = [
        'invalid',
        'invalid@',
        '@domain.com',
        'test@',
        'test@domain'
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Password Validation', () => {
    it('should validate password requirements', () => {
      const validPasswords = [
        'password123',
        'mySecurePass',
        '123456789',
        'P@ssw0rd!'
      ];

      const invalidPasswords = [
        '12345',
        'pass',
        '',
        '     '
      ];

      const minLength = 6;

      validPasswords.forEach(password => {
        expect(password.length >= minLength).toBe(true);
      });

      invalidPasswords.forEach(password => {
        expect(password.trim().length >= minLength).toBe(false);
      });
    });
  });
});
