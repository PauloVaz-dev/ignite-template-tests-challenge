

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository

    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  it('should be able create a new statement', async () => {
    const userDTO = {
      email: 'psgvaz@gmail.com',
      password: '12345',
      name: 'Paul Vaz',
    };

    const user = await createUserUseCase.execute(userDTO);

    const result = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: 'teste',
      type: 'deposit' as OperationType
    });

    expect(result).toHaveProperty('id');

  });

  it('should not be able to create a new statement with nonexistent user', async () => {
    expect(async () => {
      const result = await createStatementUseCase.execute({
        user_id: '2222222222',
        amount: 100,
        description: 'teste',
        type: 'deposit' as OperationType
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create a new statement with insufficientFunds', async () => {
    expect(async () => {
      const userDTO = {
        email: 'psgvaz@gmail.com',
        password: '12345',
        name: 'Paul Vaz',
      };

      const user = await createUserUseCase.execute(userDTO);

      const result = await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 20000,
        description: 'teste',
        type: 'withdraw' as OperationType
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});
