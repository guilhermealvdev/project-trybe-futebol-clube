import { Request, Response } from 'express';
import TeamService from '../service/TeamService';

class TeamController {
  public static async getAllTeams(req: Request, res: Response): Promise<Response> {
    const teams = await TeamService.getAllTeams();
    return res.status(200).json(teams);
  }
}

export default TeamController;
