import { Router } from 'express';
import MatchController from '../controller/MatchController';
import authMiddleware from '../middlewares/authMiddleware';

const matchRoutes = Router();

matchRoutes.get('/matches', MatchController.getAll);
matchRoutes.patch('/matches/:id/finish', authMiddleware, MatchController.finishMatch);
matchRoutes.patch('/matches/:id', authMiddleware, MatchController.updateMatch);
matchRoutes.post('/matches', authMiddleware, MatchController.createMatch);
matchRoutes.get('/leaderboard/home', MatchController.getHomeLeaderboard); // Req 23

export default matchRoutes;
