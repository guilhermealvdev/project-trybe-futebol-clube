import Teams from '../database/models/Teams';

class TeamService {
  public static async getAllTeams() {
    const teams = await Teams.findAll();
    return teams;
  }
}

export default TeamService;
