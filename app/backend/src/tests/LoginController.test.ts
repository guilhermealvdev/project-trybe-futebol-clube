import { expect } from 'chai';
import * as sinon from 'sinon';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as User from '../database/models/Users'; // Importar o modelo Users corretamente
import LoginController from '../controller/LoginController';

describe('Login Controller', () => {
  let findOneStub: sinon.SinonStub<any[], Promise<any>>;

  beforeEach(() => {
    findOneStub = sinon.stub(User.default, 'findOne'); // Acessar o método findOne através de User.default
  });

  afterEach(() => {
    findOneStub.restore();
  });

  it('should return a token when valid credentials are provided', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8)),
    };

    findOneStub.resolves(mockUser);

    const req: any = {
      body: { email: 'test@example.com', password: '123456' },
    };

    const res: any = {
      status: (statusCode: number) => ({
        json: (data: any) => ({ statusCode, ...data }),
      }),
    };

    const token = await LoginController.login(req, res);

    expect(token.statusCode).to.equal(200);
    expect(token).to.have.property('token');
  });

  it('should return status 401 if invalid credentials are provided', async () => {
    findOneStub.resolves(null);

    const req: any = {
      body: { email: 'invalid@example.com', password: 'invalidPassword' },
    };

    const res: any = {
      status: (statusCode: number) => ({
        json: (data: any) => ({ statusCode, ...data }),
      }),
    };

    const response = await LoginController.login(req, res);

    expect(response.statusCode).to.equal(401);
    expect(response).to.have.property('message', 'Invalid email or password');
  });

  it('should return status 401 if email format is invalid', async () => {
    const req: any = {
      body: { email: 'invalidemail', password: '123456' },
    };

    const res: any = {
      status: (statusCode: number) => ({
        json: (data: any) => ({ statusCode, ...data }),
      }),
    };

    const response = await LoginController.login(req, res);

    expect(response.statusCode).to.equal(401);
    expect(response).to.have.property('message', 'Invalid email or password');
  });

  it('should return status 401 if password length is less than 6 characters', async () => {
    const req: any = {
      body: { email: 'test@example.com', password: '123' },
    };

    const res: any = {
      status: (statusCode: number) => ({
        json: (data: any) => ({ statusCode, ...data }),
      }),
    };

    const response = await LoginController.login(req, res);

    expect(response.statusCode).to.equal(401);
    expect(response).to.have.property('message', 'Invalid email or password');
  });
});
