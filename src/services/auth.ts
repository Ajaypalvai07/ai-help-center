import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { mongodb } from '../lib/mongodb';
import { Collection } from 'mongodb';

interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt?: Date;
  isActive?: boolean;
}

interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthService {
  private collection: Promise<Collection<User>>;

  constructor() {
    this.collection = mongodb.getCollection<User>('users');
  }

  async login(email: string, password: string) {
    const users = await this.collection;
    const user = await users.findOne({ email });

    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email } as JWTPayload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      },
      token
    };
  }

  async register(userData: Omit<User, '_id' | 'createdAt' | 'isActive'>) {
    const users = await this.collection;
    
    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser) {
      throw new AuthError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const result = await users.insertOne({
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      isActive: true
    });

    const { password, ...userWithoutPassword } = userData;
    return {
      id: result.insertedId.toString(),
      ...userWithoutPassword
    };
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new AuthError('Invalid token');
    }
  }
}

export const authService = new AuthService();