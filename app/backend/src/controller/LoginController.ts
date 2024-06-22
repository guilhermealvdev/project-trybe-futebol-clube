import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import User from '../database/models/Users';
import authConfig from '../config/authConfig';
import { ExtendedRequest } from '../types/types';

class LoginController {
  // Logica abaixo criada apenas para testar no ThunderClient
  // public static async login(req: Request, res: Response): Promise<Response> {
  //   const user = await LoginService.getAllUsers();
  //   return res.status(200).json(user);
  // }

  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.status(200).json({ token });
  }

  public static async getRole(req: ExtendedRequest, res: Response): Promise<Response> {
    if (!req.userId) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    return res.status(200).json({ role: user.role });
  }
}

export default LoginController;
