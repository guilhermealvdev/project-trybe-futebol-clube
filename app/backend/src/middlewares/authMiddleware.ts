import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig';
import User from '../database/models/Users';
import { ExtendedRequest } from '../types/types';

const authMiddleware = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not found' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) { return res.status(401).json({ message: 'Token malformatted' }); } // Msma linha por conta de lint

  const decoded = jwt.verify(token, authConfig.secret) as { id: number };
  req.userId = decoded.id; // Adiciona o ID do usuário decodificado ao objeto req

  // Verifica se o usuário ainda existe no banco de dados
  const user = await User.findByPk(decoded.id);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  next();
};

export default authMiddleware;
