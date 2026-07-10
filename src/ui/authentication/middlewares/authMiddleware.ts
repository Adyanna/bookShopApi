import { Request, Response, NextFunction } from 'express';
//import { SegurityServices } from '../../../domain/global/SegurityService';
import { SegurityService } from '../../../infraestructure/global/SegurityService';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

export const authenticationMiddleware =
  //(securityService: SegurityServices) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    const securityService = new SegurityService();
    const isValid = securityService.verifyjwt(token.replace('Bearer ', ''));

    req.userId = isValid?.userId;
    if (!isValid) {
      throw new UnauthorizedError('Invalid token');
    }
    next();
  };
