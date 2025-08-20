import { hashPassword, verifyPassword } from '../../src/utils/hash';

describe('Hash Utils', () => {
  const testPassword = 'TestPassword123';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hashedPassword = await hashPassword(testPassword);
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(testPassword);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should create different hashes for the same password', async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      
      // Due to salt, same password should produce different hashes
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const hashedPassword = await hashPassword('');
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword, hashedPassword);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isValid = await verifyPassword('WrongPassword', hashedPassword);
      
      expect(isValid).toBe(false);
    });

    it('should reject empty password against hash', async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isValid = await verifyPassword('', hashedPassword);
      
      expect(isValid).toBe(false);
    });

    it('should handle case sensitivity', async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword.toLowerCase(), hashedPassword);
      
      expect(isValid).toBe(false);
    });
  });

  describe('Hash roundtrip', () => {
    it('should maintain password verification through hash/verify cycle', async () => {
      const passwords = [
        'SimplePassword',
        'Complex@Password123!',
        '1234567890',
        'special-chars_&*()[]{}',
        'unicode-ñáéíóú'
      ];

      for (const password of passwords) {
        const hashedPassword = await hashPassword(password);
        const isValid = await verifyPassword(password, hashedPassword);
        
        expect(isValid).toBe(true);
      }
    });
  });
});
