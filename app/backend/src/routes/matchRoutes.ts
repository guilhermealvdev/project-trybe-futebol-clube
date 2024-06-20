import { Router } from 'express';
import MatchController from '../controller/MatchController';

const matchRoutes = Router();

matchRoutes.get('/matches', MatchController.getAll);

export default matchRoutes;
