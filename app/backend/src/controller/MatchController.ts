import { Request, Response } from 'express';
import MatchService from '../service/MatchService';

class MatchController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    let matches;
    if (inProgress !== undefined) {
      const isInProgress = inProgress === 'true';
      matches = await MatchService.getMatchesByProgress(isInProgress);
    } else {
      matches = await MatchService.getAllMatches();
    }
    return res.status(200).json(matches);
  }

  static async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await MatchService.finishMatch(Number(id));
    return res.status(200).json(result);
  }

  static async updateMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const result = await MatchService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
    return res.status(200).json(result);
  }

  static async createMatch(req: Request, res: Response): Promise<Response> {
    try {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
      const newMatch = await MatchService.createMatch(
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
      );
      return res.status(201).json(newMatch);
    } catch (error: any) {
      if (error.message === 'It is not possible to create a match with two equal teams') {
        return res.status(422).json({ message: error.message });
      }
      if (error.message === 'There is no team with such id!') {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Req 23
  static async getHomeLeaderboard(req: Request, res: Response): Promise<Response> {
    try {
      const leaderboard = await MatchService.getHomeLeaderboard();
      return res.status(200).json(leaderboard);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default MatchController;
