import { SegurityServices } from '../../global/SegurityService';
import { AuthRepository } from '../repository/authRepository';
import { EntityNotFoundError } from '../../errors/EntityNotFoundError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export interface signinUseCaseInput {
  email: string;
  password: string;
}

export class SigninUseCase {
  private readonly authRepository: AuthRepository;
  private readonly segurityService: SegurityServices;

  constructor(userRepository: AuthRepository, segurityService: SegurityServices) {
    this.authRepository = userRepository;
    this.segurityService = segurityService;
  }
  async executeToken(data: signinUseCaseInput): Promise<string> {
    //verificar si esxite
    const userData = await this.authRepository.findOneUser({ email: data.email });
    if (!userData) {
      throw new EntityNotFoundError('user', data.email);
    }
    const istrue = await this.segurityService.comparepassword(data.password, userData.password);
    if (!istrue) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const jwtToken = this.segurityService.generateJwt(userData.id);
    return jwtToken;
  }
}
