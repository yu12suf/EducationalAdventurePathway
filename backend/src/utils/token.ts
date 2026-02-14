import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env['JWT_SECRET'] as string;
  const expiresIn = process.env['JWT_EXPIRES_IN'] as string;
  return jwt.sign({ id: userId, role }, secret, { expiresIn } as any);
};

export const generateVerificationToken = (userId: string): string => {
  const secret = process.env['JWT_VERIFY_SECRET'] as string;
  const expiresIn = process.env['JWT_VERIFY_EXPIRES_IN'] as string;
  return jwt.sign({ id: userId }, secret, { expiresIn } as any);
};

export const generateResetToken = (userId: string): string => {
  const secret = process.env['JWT_RESET_SECRET'] as string;
  const expiresIn = process.env['JWT_RESET_EXPIRES_IN'] as string;
  return jwt.sign({ id: userId }, secret, { expiresIn } as any);
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};