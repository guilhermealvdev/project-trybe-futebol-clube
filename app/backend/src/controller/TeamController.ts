import { Request, Response } from 'express';
import TeamService from '../service/TeamService';

class TeamController {
  public static async getAllTeams(req: Request, res: Response): Promise<Response> {
    const teams = await TeamService.getAllTeams();
    return res.status(200).json(teams);
  }

  public static async getTeamById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const team = await TeamService.getTeamById(Number(id));
    if (team) {
      return res.status(200).json(team);
    }
    return res.status(404).json({ message: 'Team not found' });
  }
}

export default TeamController;
