import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: InMemoryUsersRepository;

  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Danilo Vieira",
      email: "danilo@rocketseat.com",
      password: '123456'

    });

    expect(user).toHaveProperty('id');
  });

  it("should not be able to create new users when email is already exists", async () => {

    expect(async () => {
      await createUserUseCase.execute({
        name: "Danilo Vieira",
        email: "danilo@rocketseat.com",
        password: '123456'
      });
      await createUserUseCase.execute({
        name: "Danilo Vieira",
        email: "danilo@rocketseat.com",
        password: '123456'
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  });
});
