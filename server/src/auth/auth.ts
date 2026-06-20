import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";

export async function verifyPassword(plain: string): Promise<boolean> {
  return bcrypt.compare(plain, config.passwordHash);
}

export function signToken(): string {
  return jwt.sign({ auth: true }, config.jwtSecret, { expiresIn: "30d" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, config.jwtSecret);
    return true;
  } catch {
    return false;
  }
}
