import { Event } from "../../domain/entites/event";
import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";
import { CreateEventDTO } from "../dto/createEventDTO";

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepositoryInterface
  ) {}

  async execute(dto: CreateEventDTO): Promise<Event> {
    const now = new Date();

    const event = new Event({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      location: dto.location,
      capacity: dto.capacity,
      price: dto.price,
      createdAt: now,
      updatedAt: now,
    });

    return this.eventRepository.save(event);
  }
}
