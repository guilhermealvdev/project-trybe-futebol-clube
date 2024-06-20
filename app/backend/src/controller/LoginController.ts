import { Request, Response } from 'express';
import LoginService from '../service/LoginService';

class LoginController {
  // Logica abaixo criada apenas para testar no ThunderClient
  // public static async login(req: Request, res: Response): Promise<Response> {
  //   const user = await LoginService.getAllUsers();
  //   return res.status(200).json(user);
  // }

  public static async login(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ message: 'Alv' });
  }

}

export default LoginController;
