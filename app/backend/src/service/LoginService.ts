import User from "../database/models/Users";

class LoginService {
  // Logica abaixo foi usada apenas pra testar a rota. Nao pede em requisito.
  public static async getAllUsers() {
    const user = await User.findAll();
    return user;
  }

}

export default LoginService;
