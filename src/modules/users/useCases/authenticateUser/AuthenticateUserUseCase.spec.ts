import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUserCase: CreateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );

    createUserUserCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able authenticate an user', async () => {
    const user = {
      email: 'psgvaz@gmail.com',
      password: '12345',
      name: 'Paul Vaz',
    };

    await createUserUserCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

  });

  it('should be able to authenticate with incorrect password', async () => {
    expect(async () => {
      const user = {
        email: 'psgvaz@gmail.com',
        password: '12345',
        name: 'Paulo Vaz',
      };

      await createUserUserCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: '233',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should be able to authenticate an nonexistent user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'teste.@gmail.com',
        password: '1234',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });


});
