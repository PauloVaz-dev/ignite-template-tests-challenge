import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  it("should be able to show a balance by user id", async () => {
    const user = {
      name: "user teste",
      email: "userteste@mail.com",
      password: "123"
    }

    const userCreated = await inMemoryUsersRepository.create({
      name: user.name,
      email: user.email,
      password: user.password
    });

    await inMemoryStatementsRepository.create({
      user_id: userCreated.id as string,
      amount: 1000,
      description: 'teste',
      type: 'deposit' as OperationType
    });

   await inMemoryStatementsRepository.create({
      user_id: userCreated.id as string,
      amount: 6000,
      description: 'teste',
      type: 'deposit' as OperationType
    });

    const balance = await getBalanceUseCase.execute({
      user_id: userCreated.id as string
    })

    expect(balance.statement.length).toBe(2)
    expect(balance.balance).toBe(7000)
  });

  it("should not be able to show a balance with nonexistent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "1234" })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
