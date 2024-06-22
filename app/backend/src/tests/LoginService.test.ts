import { expect } from 'chai';
import * as bcrypt from 'bcryptjs';
import * as sinon from 'sinon';
import User from '../database/models/Users';
import LoginService from '../service/LoginService';

describe('LoginService', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      const findOneStub = sinon.stub(User, 'findOne').resolves(null);

      const result = await LoginService.validateUser('test@example.com', 'password123');

      expect(findOneStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: bcrypt.hashSync('password123', 10), // Hashed password
      };

      const findOneStub = sinon.stub(User, 'findOne').resolves(mockUser as any);
      const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(false);

      const result = await LoginService.validateUser('test@example.com', 'invalidpassword');

      expect(findOneStub.calledOnce).to.be.true;
      expect(compareSyncStub.calledOnce).to.be.true;
      expect(result).to.be.null;
    });

    it('should return user object if email and password are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: bcrypt.hashSync('password123', 10), // Hashed password
      };

      const findOneStub = sinon.stub(User, 'findOne').resolves(mockUser as any);
      const compareSyncStub = sinon.stub(bcrypt, 'compareSync').returns(true);

      const result = await LoginService.validateUser('test@example.com', 'password123');

      expect(findOneStub.calledOnce).to.be.true;
      expect(compareSyncStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockUser);
    });
  });
});
