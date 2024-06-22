import { expect } from 'chai';
import * as sinon from 'sinon';
import TeamService from '../service/TeamService';
import Team from '../database/models/Teams';

describe('TeamService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getAllTeams', () => {
    it('should return all teams', async () => {
      // Stubbing the findAll method of Team model
      const findAllStub = sinon.stub(Team, 'findAll').resolves([
        { id: 1, teamName: 'Team A' },
        { id: 2, teamName: 'Team B' },
        { id: 3, teamName: 'Team C' },
      ] as any);

      // Call the getAllTeams method from TeamService
      const teams = await TeamService.getAllTeams();

      // Assertion
      expect(findAllStub.calledOnce).to.be.true;
      expect(teams).to.be.an('array').with.lengthOf(3);
      expect(teams[0]).to.deep.include({ id: 1, teamName: 'Team A' });
      expect(teams[1]).to.deep.include({ id: 2, teamName: 'Team B' });
      expect(teams[2]).to.deep.include({ id: 3, teamName: 'Team C' });
    });

    it('should return an empty array if no teams are found', async () => {
      // Stubbing the findAll method of Team model to resolve with an empty array
      const findAllStub = sinon.stub(Team, 'findAll').resolves([]);

      // Call the getAllTeams method from TeamService
      const teams = await TeamService.getAllTeams();

      // Assertion
      expect(findAllStub.calledOnce).to.be.true;
      expect(teams).to.be.an('array').that.is.empty;
    });
  });

  describe('getTeamById', () => {
    it('should return the team with the specified id', async () => {
      // Stubbing the findByPk method of Team model
      const findByPkStub = sinon.stub(Team, 'findByPk').resolves({ id: 1, teamName: 'Team A' } as any);

      // Call the getTeamById method from TeamService
      const team = await TeamService.getTeamById(1);

      // Assertion
      expect(findByPkStub.calledOnceWith(1)).to.be.true;
      expect(team).to.deep.equal({ id: 1, teamName: 'Team A' });
    });

    it('should return null if no team is found with the specified id', async () => {
      // Stubbing the findByPk method of Team model to resolve with null
      const findByPkStub = sinon.stub(Team, 'findByPk').resolves(null);

      // Call the getTeamById method from TeamService
      const team = await TeamService.getTeamById(1);

      // Assertion
      expect(findByPkStub.calledOnceWith(1)).to.be.true;
      expect(team).to.be.null;
    });
  });
});
