import { signUpUseCaseInput } from '../authCases/signupUseCase';
import { User } from '../User';

export interface UserFiltrQuery {
  email?: string;
  id?: number;
}

export interface AuthRepository {
  findOneUser: (params: UserFiltrQuery) => Promise<User | null>;
  create: (params: signUpUseCaseInput) => Promise<User>;
}
