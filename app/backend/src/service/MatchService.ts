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
}

export default MatchService;
