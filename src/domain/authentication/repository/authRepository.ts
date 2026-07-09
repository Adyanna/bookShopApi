import { signUpUseCaseInput } from '../authCases/signupUseCase';
import { User } from '../User';

export interface AuthRepository {
  findByEmail: (email: string) => Promise<User | null>;
  create: (params: signUpUseCaseInput) => Promise<User>;
}
