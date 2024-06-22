import { expect } from 'chai';
import { Request, Response } from 'express';
import * as sinon from 'sinon';
import TeamService from '../service/TeamService';
import TeamController from '../controller/TeamController';

describe('Team Controller', () => {
  describe('getAllTeams', () => {
    it('should get all teams', async () => {
      const req: Partial<Request> = {};
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockTeams = [{ id: 1, name: 'Team A' }, { id: 2, name: 'Team B' }];
      sinon.stub(TeamService, 'getAllTeams').resolves(mockTeams as any);

      await TeamController.getAllTeams(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockTeams);

      (TeamService.getAllTeams as sinon.SinonStub).restore();
    });
  });

  describe('getTeamById', () => {
    it('should get a team by id', async () => {
      const req: Partial<Request> = { params: { id: '1' } };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const mockTeam = { id: 1, name: 'Team A' };
      sinon.stub(TeamService, 'getTeamById').resolves(mockTeam as any);

      await TeamController.getTeamById(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 200);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, mockTeam);

      (TeamService.getTeamById as sinon.SinonStub).restore();
    });

    it('should handle team not found', async () => {
      const req: Partial<Request> = { params: { id: '999' } };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const errorMessage = 'Team not found';
      sinon.stub(TeamService, 'getTeamById').resolves(undefined);

      await TeamController.getTeamById(req as Request, res as Response);

      sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 404);
      sinon.assert.calledWithExactly(res.json as sinon.SinonStub, { message: errorMessage });

      (TeamService.getTeamById as sinon.SinonStub).restore();
    });
  });
});
