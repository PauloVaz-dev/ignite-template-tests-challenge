import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUserCase: CreateUserUseCase

describe('Prifile User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUserCase = new CreateUserUseCase(inMemoryUsersRepository)

    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able authenticate an user', async () => {
    const userDTO = {
      email: 'psgvaz@gmail.com',
      password: '12345',
      name: 'Paul Vaz',
    };

    const user = await createUserUserCase.execute(userDTO);

    const result = await showUserProfileUseCase.execute(
      user.id as string
    );

    expect(result).toHaveProperty('id');

  });

  it('should not be able to show an nonexistent user', async () => {

    expect(async () => {
      const userDTO = {
        email: 'psgvaz@gmail.com',
        password: '12345',
        name: 'Paul Vaz',
      };

      const user = await createUserUserCase.execute(userDTO);

      const result = await showUserProfileUseCase.execute(
        '222222222222222222222'
      );
    }).rejects.toBeInstanceOf(ShowUserProfileError)





  });

  // it('should be able to authenticate with incorrect password', async () => {
  //   expect(async () => {
  //     const user = {
  //       email: 'psgvaz@gmail.com',
  //       password: '12345',
  //       name: 'Paulo Vaz',
  //     };

  //     await createUserUserCase.execute(user);

  //     await authenticateUserUseCase.execute({
  //       email: user.email,
  //       password: '233',
  //     });
  //   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  // });

  // it('should be able to authenticate an nonexistent user', async () => {
  //   expect(async () => {
  //     await authenticateUserUseCase.execute({
  //       email: 'teste.@gmail.com',
  //       password: '1234',
  //     });
  //   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  // });


});
