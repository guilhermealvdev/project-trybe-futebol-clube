import { Request, Response } from 'express';
import MatchService from '../service/MatchService';

class MatchController {
  static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { inProgress } = req.query;
      let matches;
      if (inProgress !== undefined) {
        const isInProgress = inProgress === 'true';
        matches = await MatchService.getMatchesByProgress(isInProgress);
      } else {
        matches = await MatchService.getAllMatches();
      }
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default MatchController;
