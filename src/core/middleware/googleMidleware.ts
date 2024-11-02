import * as passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export class GoogleAuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }

  static callback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  }
}
