//import { PrismaClient } from '@prisma/client';
import { AuthRepository } from '../../domain/authentication/repository/authRepository';
import { signUpUseCaseInput } from '../../domain/authentication/authCases/signupUseCase';
import { User } from '../../domain/authentication/User';
import { prismaClient } from '../global/PrismaClient';
import { UserFiltrQuery } from '../../domain/authentication/repository/authRepository';

type PrismaUser = {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  password: string;
  createdAt: Date;
};

export class signupPrismaRepository implements AuthRepository {
  private readonly prisma = prismaClient;

  async findOneUser(params: UserFiltrQuery): Promise<User | null> {
    const where: {
      email?: string;
      id?: number;
    } = {};

    if (params.email) {
      where.email = params.email;
    }

    if (params.id) {
      where.id = params.id;
    }

    const prismaUser = await this.prisma.user.findFirst({
      where,
    });

    if (!prismaUser) {
      return null;
    } else {
      return this.restore(prismaUser);
    }
  }
  async create(params: signUpUseCaseInput): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
      },
    });
    return this.restore(newUser);
  }

  private restore(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      createAt: prismaUser.createdAt,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      password: prismaUser.password,
    });
  }
}
