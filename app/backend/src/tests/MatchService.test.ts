import { expect } from 'chai';
import * as sinon from 'sinon';
import MatchService from '../service/MatchService';
import Match from '../database/models/Matches';
import Team from '../database/models/Teams';

describe('MatchService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getAllMatches', () => {
    it('should return all matches with homeTeam and awayTeam names', async () => {
      // Stubbing the findAll method of Match model
      const findAllStub = sinon.stub(Match, 'findAll').resolves([
        {
          id: 1,
          homeTeamId: 1,
          awayTeamId: 2,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeam: { teamName: 'Team A' },
          awayTeam: { teamName: 'Team B' },
        } as any,
        {
          id: 2,
          homeTeamId: 3,
          awayTeamId: 4,
          homeTeamGoals: 0,
          awayTeamGoals: 0,
          inProgress: false,
          homeTeam: { teamName: 'Team C' },
          awayTeam: { teamName: 'Team D' },
        } as any,
      ]);

      // Call the getAllMatches method from MatchService
      const matches = await MatchService.getAllMatches();

      // Assertion
      expect(findAllStub.calledOnce).to.be.true;
      expect(matches).to.be.an('array').with.lengthOf(2);
      expect(matches[0]).to.deep.include({
        id: 1,
        homeTeamGoals: 2,
        awayTeamGoals: 1,
        inProgress: true,
        homeTeam: { teamName: 'Team A' },
        awayTeam: { teamName: 'Team B' },
      });
      expect(matches[1]).to.deep.include({
        id: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: false,
        homeTeam: { teamName: 'Team C' },
        awayTeam: { teamName: 'Team D' },
      });
    });
  });

  describe('getMatchesByProgress', () => {
    it('should return empty array if no matches with inProgress true', async () => {
      // Stubbing the findAll method of Match model to resolve with empty array
      const findAllStub = sinon.stub(Match, 'findAll').resolves([]);

      // Call the getMatchesByProgress method from MatchService
      const matches = await MatchService.getMatchesByProgress(true);

      // Assertion
      expect(findAllStub.calledOnce).to.be.true;
      expect(matches).to.be.an('array').that.is.empty;
    });
  });

  describe('finishMatch', () => {
    it('should update match inProgress to false', async () => {
      // Stubbing the update method of Match model
      const updateStub = sinon.stub(Match, 'update').resolves([1]);

      // Call the finishMatch method from MatchService
      const result = await MatchService.finishMatch(1);

      // Assertion
      expect(updateStub.calledOnceWith({ inProgress: false }, { where: { id: 1, inProgress: true } })).to.be.true;
      expect(result).to.deep.equal({ message: 'Finished' });
    });
  });

  describe('updateMatch', () => {
    it('should update match with provided goals', async () => {
      // Stubbing the update method of Match model
      const updateStub = sinon.stub(Match, 'update').resolves([1]);

      // Call the updateMatch method from MatchService
      const result = await MatchService.updateMatch(1, 3, 2);

      // Assertion
      expect(updateStub.calledOnceWith({ homeTeamGoals: 3, awayTeamGoals: 2 }, { where: { id: 1, inProgress: true } })).to.be.true;
      expect(result).to.deep.equal({ message: 'Match updated successfully' });
    });
  });

  describe('createMatch', () => {
    it('should create a new match with valid teams', async () => {
      // Stubbing the methods of Team model
      const findByPkStub = sinon.stub(Team, 'findByPk');
      findByPkStub.withArgs(1).resolves({ id: 1 } as any);
      findByPkStub.withArgs(2).resolves({ id: 2 } as any);

      // Stubbing the create method of Match model
      const createStub = sinon.stub(Match, 'create').resolves({
        id: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      } as any);

      // Call the createMatch method from MatchService
      const newMatch = await MatchService.createMatch(1, 2, 0, 0);

      // Assertion
      expect(findByPkStub.calledTwice).to.be.true;
      expect(createStub.calledOnceWith({
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      })).to.be.true;
      expect(newMatch).to.deep.include({
        id: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      });
    });

  describe('getFinishedMatches', () => {
    it('should return all finished matches with homeTeam names', async () => {
      // Stubbing the findAll method of Match model
      const findAllStub = sinon.stub(Match, 'findAll').resolves([
        {
          id: 1,
          homeTeamId: 1,
          awayTeamId: 2,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: false,
          homeTeam: { teamName: 'Team A' },
        } as any,
        {
          id: 2,
          homeTeamId: 3,
          awayTeamId: 4,
          homeTeamGoals: 0,
          awayTeamGoals: 0,
          inProgress: false,
          homeTeam: { teamName: 'Team C' },
        } as any,
      ]);

      // Call the getFinishedMatches method from MatchService
      const matches = await MatchService.getFinishedMatches();

      // Assertion
      expect(findAllStub.calledOnce).to.be.true;
      expect(matches).to.be.an('array').with.lengthOf(2);
      expect(matches[0]).to.deep.include({
        id: 1,
        homeTeamGoals: 2,
        awayTeamGoals: 1,
        inProgress: false,
        homeTeam: { teamName: 'Team A' },
      });
      expect(matches[1]).to.deep.include({
        id: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: false,
        homeTeam: { teamName: 'Team C' },
      });
    });
  });

  describe('calculateTotalPoints', () => {
    it('should calculate total points based on match results', () => {
      const matches = [
        { homeTeamGoals: 2, awayTeamGoals: 1 } as any,
        { homeTeamGoals: 0, awayTeamGoals: 0 } as any,
        { homeTeamGoals: 1, awayTeamGoals: 2 } as any,
      ];

      const totalPoints = MatchService.calculateTotalPoints(matches);

      expect(totalPoints).to.equal(4);
    });
  });

  describe('countVictories', () => {
    it('should count victories based on match results', () => {
      const matches = [
        { homeTeamGoals: 2, awayTeamGoals: 1 } as any,
        { homeTeamGoals: 0, awayTeamGoals: 0 } as any,
        { homeTeamGoals: 1, awayTeamGoals: 2 } as any,
      ];

      const totalVictories = MatchService.countVictories(matches);

      expect(totalVictories).to.equal(1);
    });
  });

  describe('calculateGoals', () => {
    it('should calculate total goals based on match results', () => {
      const matches = [
        { homeTeamGoals: 2, awayTeamGoals: 1 } as any,
        { homeTeamGoals: 0, awayTeamGoals: 0 } as any,
        { homeTeamGoals: 1, awayTeamGoals: 2 } as any,
      ];

      const totalGoals = MatchService.calculateGoals(matches, 'homeTeamGoals');

      expect(totalGoals).to.equal(3);
    });
  });
});
});
