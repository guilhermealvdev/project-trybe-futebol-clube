import { Router } from 'express';
import LoginController from '../controller/LoginController';
import authMiddleware from '../middlewares/authMiddleware';

const loginRoutes = Router();

loginRoutes.post('/login', LoginController.login);
loginRoutes.get('/login/role', authMiddleware, LoginController.getRole);

export default loginRoutes;
