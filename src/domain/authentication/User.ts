import { Entity, EntityProps } from '../global/Entity';

interface UserProps extends EntityProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class User extends Entity {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;

  constructor(props: UserProps) {
    super({ id: props.id, createAt: props.createAt });
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
  }
}
