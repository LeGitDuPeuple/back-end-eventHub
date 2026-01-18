import { Event } from "../../domain/entites/event";
import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";

export class GetOneEventUseCase {
  constructor(
    private readonly eventRepository: EventRepositoryInterface
  ) {}

  async execute(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }
}
