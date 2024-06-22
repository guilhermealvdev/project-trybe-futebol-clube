import Match from '../database/models/Matches';
import Team from '../database/models/Teams';

class MatchService {
  static async getAllMatches() {
    return Match.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
  }

  static async getMatchesByProgress(inProgress: boolean) {
    return Match.findAll({
      where: { inProgress },
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
  }

  static async finishMatch(id: number) {
    await Match.update(
      { inProgress: false },
      { where: { id, inProgress: true } },
    );
    return { message: 'Finished' };
  }

  static async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await Match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id, inProgress: true } },
    );
    return { message: 'Match updated successfully' };
  }

  private static async validateTeams(homeTeamId: number, awayTeamId: number) {
    if (homeTeamId === awayTeamId) {
      throw new Error('It is not possible to create a match with two equal teams');
    }

    const homeTeam = await Team.findByPk(homeTeamId);
    const awayTeam = await Team.findByPk(awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new Error('There is no team with such id!');
    }
  }

  private static async createNewMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) {
    return Match.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });
  }

  static async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) {
    await this.validateTeams(homeTeamId, awayTeamId);
    const newMatch = await this.createNewMatch(
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
    );
    return newMatch;
  }
}

export default MatchService;
