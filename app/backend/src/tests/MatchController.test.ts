import { expect } from 'chai';
import { Request, Response } from 'express';
import * as sinon from 'sinon';
import MatchService from '../service/MatchService';
import MatchController from '../controller/MatchController';

describe('Match Controller', () => {
  describe('getAll', () => {
    it('should get all matches', async () => {
      const req: Partial<Request> = { query: {} };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockMatches = [{ id: 1, homeTeamId: 1, awayTeamId: 2 }];
      sinon.stub(MatchService, 'getAllMatches').resolves(mockMatches as any);

      await MatchController.getAll(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockMatches);

      (MatchService.getAllMatches as sinon.SinonStub).restore();
    });

    it('should get matches in progress', async () => {
      const req: Partial<Request> = { query: { inProgress: 'true' } };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockMatches = [{ id: 2, homeTeamId: 3, awayTeamId: 4 }];
      sinon.stub(MatchService, 'getMatchesByProgress').resolves(mockMatches as any);

      await MatchController.getAll(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockMatches);

      (MatchService.getMatchesByProgress as sinon.SinonStub).restore();
    });
});

  describe('finishMatch', () => {
    it('should finish a match', async () => {
      const req: Partial<Request> = { params: { id: '1' } };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockResult = { id: 1, finished: true };
      sinon.stub(MatchService, 'finishMatch').resolves(mockResult as any);

      await MatchController.finishMatch(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockResult);

      (MatchService.finishMatch as sinon.SinonStub).restore();
    });
  });

  describe('updateMatch', () => {
    it('should update a match', async () => {
      const req: Partial<Request> = { params: { id: '1' }, body: { homeTeamGoals: 2, awayTeamGoals: 1 } };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockResult = { id: 1, homeTeamGoals: 2, awayTeamGoals: 1 };
      sinon.stub(MatchService, 'updateMatch').resolves(mockResult as any);

      await MatchController.updateMatch(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockResult);

      (MatchService.updateMatch as sinon.SinonStub).restore();
    });
  });

  describe('createMatch', () => {
    it('should create a match', async () => {
      const req: Partial<Request> = {
        body: { homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 3, awayTeamGoals: 2 },
      };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockNewMatch = { id: 3, homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 3, awayTeamGoals: 2 };
      sinon.stub(MatchService, 'createMatch').resolves(mockNewMatch as any);

      await MatchController.createMatch(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 201);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockNewMatch);

      (MatchService.createMatch as sinon.SinonStub).restore();
    });

    it('should handle error if creating match with two equal teams', async () => {
      const req: Partial<Request> = {
        body: { homeTeamId: 1, awayTeamId: 1, homeTeamGoals: 3, awayTeamGoals: 2 },
      };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const errorMessage = 'It is not possible to create a match with two equal teams';
      sinon.stub(MatchService, 'createMatch').rejects(new Error(errorMessage));

      await MatchController.createMatch(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 422);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, { message: errorMessage });

      (MatchService.createMatch as sinon.SinonStub).restore();
    });

    it('should handle error if team id not found', async () => {
      const req: Partial<Request> = {
        body: { homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 3, awayTeamGoals: 2 },
      };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const errorMessage = 'There is no team with such id!';
      sinon.stub(MatchService, 'createMatch').rejects(new Error(errorMessage));

      await MatchController.createMatch(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 404);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, { message: errorMessage });

      (MatchService.createMatch as sinon.SinonStub).restore();
    });

    it('should handle other internal errors', async () => {
      const req: Partial<Request> = {
        body: { homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 3, awayTeamGoals: 2 },
      };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const errorMessage = 'Internal server error';
      sinon.stub(MatchService, 'createMatch').rejects(new Error(errorMessage));

      await MatchController.createMatch(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 500);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, { message: errorMessage });

      (MatchService.createMatch as sinon.SinonStub).restore();
    });
  });

  describe('getHomeLeaderboard', () => {
    it('should get home leaderboard', async () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockLeaderboard = [{ teamId: 1, points: 20 }];
      sinon.stub(MatchService, 'getHomeLeaderboard').resolves(mockLeaderboard as any);

      await MatchController.getHomeLeaderboard(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockLeaderboard);

      (MatchService.getHomeLeaderboard as sinon.SinonStub).restore();
    });

    it('should handle errors', async () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const errorMessage = 'Internal server error';
      sinon.stub(MatchService, 'getHomeLeaderboard').rejects(new Error(errorMessage));

      await MatchController.getHomeLeaderboard(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 500);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, { message: errorMessage });

      (MatchService.getHomeLeaderboard as sinon.SinonStub).restore();
    });
  });
});
