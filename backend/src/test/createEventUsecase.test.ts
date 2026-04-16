import { CreateEventUseCase } from "../application/usecases/createEventUsecase";
import { InMemoryEventRepository } from "../infrastrucrute/repository/inMemoryEventRepository";

describe("CreateEventUseCase", () => {
  let repository: InMemoryEventRepository;
  let useCase: CreateEventUseCase;

  const validEventDTO = {
    title: "Concert de Jazz",
    description: "Un super concert",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    location: "Paris",
    capacity: 100,
    price: 20,
  };

  beforeEach(() => {
    repository = new InMemoryEventRepository();
    useCase = new CreateEventUseCase(repository);
  });

  it("crée un événement avec des données valides", async () => {
    const event = await useCase.execute(validEventDTO);

    expect(event.id).toBeDefined();
    expect(event.title).toBe(validEventDTO.title);
  });

  it("échoue si le titre est vide", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, title: "" })
    ).rejects.toThrow("Event title is required");
  });

  // it("échoue si la date est dans le passé", async () => {
  //   await expect(
  //     useCase.execute({
  //       ...validEventDTO,
  //       startDate: new Date(Date.now() - 1000),
  //     })
  //   ).rejects.toThrow("Event start date must be in the future");
  // });

  it("échoue si la capacité est négative", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, capacity: -10 })
    ).rejects.toThrow("Event capacity must be greater than 0");
  });

  it("échoue si le lieu est vide", async () => {
    await expect(
      useCase.execute({ ...validEventDTO, location: "" })
    ).rejects.toThrow("Event location is required");
  });
});
