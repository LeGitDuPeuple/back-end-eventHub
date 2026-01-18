import { Event } from "../../domain/entites/event";
import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";

export class InMemoryEventRepository implements EventRepositoryInterface {
  private events: Event[] = [];

  async save(event: Event): Promise<Event> {
    // On simule un ID comme une vraie BDD
    const eventWithId = new Event({
      ...event,
      id: Date.now().toString(),
    });

    this.events.push(eventWithId);
    return eventWithId;
  }

  async findById(id: string): Promise<Event | null> {
    return this.events.find(event => event.id === id) || null;
  }

  async findAll(): Promise<Event[]> {
    return this.events;
  }

  async update(event: Event): Promise<Event> {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    this.events[index] = event;
    return event;
  }

  async delete(id: string): Promise<void> {
    this.events = this.events.filter(event => event.id !== id);
  }
}
