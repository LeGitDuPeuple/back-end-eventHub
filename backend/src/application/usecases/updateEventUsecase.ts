import { Event } from "../../domain/entites/event";
import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";

interface UpdateEventDTO {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  location: string;
  capacity: number;
  price: number;
}

export class UpdateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepositoryInterface
  ) {}

  async execute(dto: UpdateEventDTO): Promise<Event> {
    const existing = await this.eventRepository.findById(dto.id);

    if (!existing) {
      throw new Error("Event not found");
    }

    const updatedEvent = new Event({
      id: dto.id,
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      location: dto.location,
      capacity: dto.capacity,
      price: dto.price,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.eventRepository.update(updatedEvent);
  }
}
