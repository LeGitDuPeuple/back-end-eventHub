import { PrismaClient } from "@prisma/client";
import { Event } from "../../domain/entites/event";
import { EventRepositoryInterface } from "../../domain/interface/eventRepositoryInterface";

const prisma = new PrismaClient();

export class EventRepositoryDatabase implements EventRepositoryInterface {

  async save(event: Event): Promise<Event> {
    const created = await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
      },
    });

    return new Event({
      id: created.id,
      title: created.title,
      description: created.description,
      startDate: created.startDate,
      location: created.location,
      capacity: created.capacity,
      price: created.price,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }


async findById(id: string): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) return null;

  return new Event({
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    location: event.location,
    capacity: event.capacity,
    price: event.price,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  });
}


 async findAll(): Promise<Event[]> {
  const events = await prisma.event.findMany();

  return events.map(
    (event) =>
      new Event({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      })
  );
}


async update(event: Event): Promise<Event> {
  const updated = await prisma.event.update({
    where: { id: event.id! },
    data: {
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      location: event.location,
      capacity: event.capacity,
      price: event.price,
      updatedAt: new Date(),
    },
  });

  return new Event({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    startDate: updated.startDate,
    location: updated.location,
    capacity: updated.capacity,
    price: updated.price,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
}


async delete(id: string): Promise<void> {
  await prisma.event.delete({
    where: { id },
  });
}
}