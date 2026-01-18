import { Event } from "../entites/event";

export interface EventRepositoryInterface {
  save(event: Event): Promise<Event>;

  findById(id: string): Promise<Event | null>;

  findAll(): Promise<Event[]>;

  update(event: Event): Promise<Event>;

  delete(id: string): Promise<void>;
}
