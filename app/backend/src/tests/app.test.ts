import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import errorMiddleware from '../middlewares/errorMiddleware';
import teamRoutes from '../routes/teamRoutes';
import loginRoutes from '../routes/loginRoutes';
import matchRoutes from '../routes/matchRoutes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.config();

    this.app.get('/', (req: Request, res: Response) => res.json({ ok: true }));

    this.app.use('/teams', teamRoutes);
    this.app.use('/login', loginRoutes);
    this.app.use('/matches', matchRoutes);

    this.app.use(errorMiddleware);
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };
