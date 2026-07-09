import { NextFunction, Request, Response } from 'express';
import { SignUpUseCase } from '../../../domain/authentication/authCases/signupUseCase';
import { SegurityService } from '../../../infraestructure/global/SegurityService';
import { signupPrismaRepository } from '../../../infraestructure/authentication/signupPrismaRepository';

export const signupAuthController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, lastName, firstName } = req.body;
  if (!email || !password || !lastName || !firstName) {
    res.status(400).json({ error: 'Los campos son obligatorios' });
    return;
  }
  try {
    const segurityService = new SegurityService();
    const prismaUseRepository = new signupPrismaRepository();
    const signUpUseCase = new SignUpUseCase(prismaUseRepository, segurityService);
    await signUpUseCase.executeUser({ email, password, lastName, firstName });
    res.status(201).json({ message: 'User create succesfully' });
  } catch (error: unknown) {
    next(error);
  }
};
