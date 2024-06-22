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

  // Req 23
  static async getHomeLeaderboard() {
    const matches = await this.getFinishedMatches();
    const teams = await Team.findAll();
    return teams.map((team) => this.getTeamStats(team, matches));
  }

  static async getFinishedMatches() {
    return Match.findAll({
      where: { inProgress: false },
      include: [{ model: Team, as: 'homeTeam', attributes: ['teamName'] }],
    });
  }

  static getTeamStats(team: Team, matches: Match[]) {
    const homeMatches = matches.filter((match) => match.homeTeamId === team.id);
    const totalPoints = this.calculateTotalPoints(homeMatches);
    const totalGames = homeMatches.length;
    const totalVictories = this.countVictories(homeMatches);
    const totalDraws = this.countDraws(homeMatches);
    const totalLosses = this.countLosses(homeMatches);
    const goalsFavor = this.calculateGoals(homeMatches, 'homeTeamGoals');
    const goalsOwn = this.calculateGoals(homeMatches, 'awayTeamGoals');

    return {
      name: team.teamName,
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
    };
  }

  static calculateTotalPoints(matches: Match[]) {
    return matches.reduce((sum, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) return sum + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return sum + 1;
      return sum;
    }, 0);
  }

  static countVictories(matches: Match[]) {
    return matches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
  }

  static countDraws(matches: Match[]) {
    return matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
  }

  static countLosses(matches: Match[]) {
    return matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals).length;
  }

  static calculateGoals(matches: Match[], goalType: 'homeTeamGoals' | 'awayTeamGoals') {
    return matches.reduce((sum, match) => sum + match[goalType], 0);
  }
}

export default MatchService;
