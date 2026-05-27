import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../repositories/user.repository';
import { User, UserRole } from '@producthubb/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-prod';

export class AuthService {
  async register(data: Partial<User> & { passwordHash?: string, password?: string }) {
    const { email, password, role } = data;

    const existing = await UserModel.findOne({ email });
    if (existing) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(password!, 12);

    const user = await UserModel.create({
      email,
      passwordHash,
      role: role || 'SalesRep',
    });

    return this.removePassword(user);
  }

  async login(email: string, pass: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isValid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: this.removePassword(user),
    };
  }

  private removePassword(user: IUser) {
    const userObj = user.toObject();
    delete userObj.passwordHash;
    return userObj;
  }
}

export const authService = new AuthService();
