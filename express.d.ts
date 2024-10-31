// /express.d.ts

import { IUser } from "./src/futures/auth/entities/auth.entity";


declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
