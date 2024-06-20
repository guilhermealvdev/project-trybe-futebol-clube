import * as bcrypt from 'bcryptjs';
import User from '../database/models/Users';

class LoginService {
  public static async validateUser(email: string, password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}

export default LoginService;
