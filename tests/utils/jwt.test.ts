import { signJwt, verifyJwt } from '../../src/utils/jwt';

describe('JWT Utils', () => {
  const testPayload = { userId: 123 };

  describe('signJwt', () => {
    it('should create a valid JWT token', () => {
      const token = signJwt(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts separated by dots
    });

    it('should create different tokens for different payloads', () => {
      const token1 = signJwt({ userId: 1 });
      const token2 = signJwt({ userId: 2 });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyJwt', () => {
    it('should verify a valid token', () => {
      const token = signJwt(testPayload);
      const decoded = verifyJwt(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => verifyJwt(invalidToken)).toThrow();
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';
      
      expect(() => verifyJwt(malformedToken)).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => verifyJwt('')).toThrow();
    });
  });

  describe('JWT roundtrip', () => {
    it('should maintain payload integrity through sign/verify cycle', () => {
      const originalPayload = { 
        userId: 456, 
        email: 'test@example.com',
        role: 'user'
      };
      
      const token = signJwt(originalPayload);
      const decodedPayload = verifyJwt(token);
      
      expect(decodedPayload.userId).toBe(originalPayload.userId);
      expect(decodedPayload.email).toBe(originalPayload.email);
      expect(decodedPayload.role).toBe(originalPayload.role);
    });
  });
});
