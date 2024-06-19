import { Router } from 'express';
import TeamController from '../controller/TeamController';

const teamRoutes = Router();

// teamRoutes.get('/teams', (req, res) => {
//     res.status(200).json({ message: 'Alvarez Teste 001' }); // Apenas pra testar o end point
// });

teamRoutes.get('/teams', TeamController.getAllTeams);

export default teamRoutes;
