import { Router } from 'express';
import LoginController from '../controller/LoginController';

const loginRoutes = Router();

// loginRoutes.post('/login', (req, res) => {
//   res.status(200).json({ message: 'Alvarez Teste 002' }); // Metodo POST! Usar ThunderClient pra visualizar
// })

loginRoutes.post('/login', LoginController.login);

export default loginRoutes;
