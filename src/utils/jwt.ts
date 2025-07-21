import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set.');
}

export function signJwt(
  payload: Record<string, any>,
  expiresIn: string | number = '7d'
) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}
