import Teams from '../database/models/Teams';

class TeamService {
  public static async getAllTeams() {
    const teams = await Teams.findAll();
    return teams;
  }

  public static async getTeamById(id: number) {
    const team = await Teams.findByPk(id);
    return team;
  }
}

export default TeamService;
