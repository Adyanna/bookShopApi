import { BusinessConflictError } from '../../errors/BusinessConflictError';
import { SegurityServices } from '../../global/SegurityService';
import { AuthRepository } from '../repository/authRepository';
import { ValidationError } from '../../errors/ValidationError';

import { User } from '../User';

export interface signUpUseCaseInput {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

export class SignUpUseCase {
  private readonly authRepository: AuthRepository;
  private readonly segurityService: SegurityServices;

  constructor(authRepository: AuthRepository, segurityService: SegurityServices) {
    this.authRepository = authRepository;
    this.segurityService = segurityService;
  }

  async executeUser(props: signUpUseCaseInput): Promise<User> {
    //if(props.password)
    const user = await this.authRepository.findOneUser({ email: props.email });
    if (user) {
      //throw new Error('USER_ALREADY_EXISTS');
      throw new BusinessConflictError('An user with this email already exists');
    }
    this.validateEmail(props.email);
    this.validatePassword(props.password);
    const HashPassword = await this.segurityService.hash(props.password);
    const newUser = this.authRepository.create({ ...props, password: HashPassword });
    return newUser;
  }

  private validatePassword(password: string) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new ValidationError('The password provided is incorrect');
    }
  }

  private validateEmail(email: string) {
    const emailReges = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReges.test(email)) {
      throw new ValidationError('The email provided is incorrect'); //BadSyntaxError('Invalid email format');
    }
  }
}
