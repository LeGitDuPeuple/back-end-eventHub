import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";

export class DeleteEventUseCase {
  constructor(
    private readonly eventRepository: EventRepositoryInterface
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.eventRepository.findById(id);

    if (!existing) {
      throw new Error("Event not found");
    }

    await this.eventRepository.delete(id);
  }
}
