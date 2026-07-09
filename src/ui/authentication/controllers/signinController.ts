import { NextFunction, Request, Response } from 'express';
//import { CreateUserUseCase } from '../../../domain/user/use-cases/create_user';
import { SegurityService } from '../../../infraestructure/global/SegurityService';
import { signupPrismaRepository } from '../../../infraestructure/authentication/signupPrismaRepository';
import { SigninUseCase } from '../../../domain/authentication/authCases/signinUseCase';

export const signinController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Error los datos no son validos' });
    return;
  }

  try {
    const segurityService = new SegurityService();
    const userRepository = new signupPrismaRepository();
    const LoginUser = new SigninUseCase(userRepository, segurityService);
    const resp = await LoginUser.executeToken({ email, password });

    res.status(200).json({ token: resp });
  } catch (error: unknown) {
    next(error);
  }
};
