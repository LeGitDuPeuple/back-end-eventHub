import { Event } from "../../domain/entites/event";
import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";

export class GetAllEventUseCase {
  constructor(
    private readonly eventRepository: EventRepositoryInterface
  ) {}

  async execute(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }
}