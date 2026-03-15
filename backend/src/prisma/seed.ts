import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Optionnel : Nettoie la table avant pour éviter les doublons
  // await prisma.event.deleteMany();

  await prisma.event.createMany({
    data: [
      { title: "Concert Jul", description: "Le J c'est le S", startDate: new Date("2026-03-01T20:00:00.000Z"), location: "Marseille", capacity: 60000, price: 50 },
      { title: "Conférence Tech", description: "Cloud et DevOps", startDate: new Date("2026-04-10T09:00:00.000Z"), location: "Lyon", capacity: 300, price: 0 },
      { title: "Meetup Startup", description: "Networking", startDate: new Date("2026-05-05T18:30:00.000Z"), location: "Paris", capacity: 80, price: 10 },
      { title: "Festival Electro", description: "DJ Set toute la nuit", startDate: new Date("2026-07-15T22:00:00.000Z"), location: "Nice", capacity: 500, price: 35 },
      { title: "Salon du Manga", description: "Cosplay et dédicaces", startDate: new Date("2026-06-20T10:00:00.000Z"), location: "Bordeaux", capacity: 1000, price: 15 },
      { title: "Atelier Cuisine", description: "Apprendre à faire des sushis", startDate: new Date("2026-03-25T14:00:00.000Z"), location: "Nantes", capacity: 15, price: 45 },
      { title: "Match de Gala", description: "Foot caritatif", startDate: new Date("2026-08-12T19:00:00.000Z"), location: "Lille", capacity: 2000, price: 5 },
      { title: "Expo Peinture", description: "Art contemporain", startDate: new Date("2026-09-02T11:00:00.000Z"), location: "Montpellier", capacity: 100, price: 0 },
      { title: "Stand-up Comedy", description: "Soirée rire", startDate: new Date("2026-04-15T21:00:00.000Z"), location: "Toulouse", capacity: 50, price: 20 },
      { title: "Course 10km", description: "Marathon de la ville", startDate: new Date("2026-10-10T08:00:00.000Z"), location: "Rennes", capacity: 500, price: 12 },
    ],
  });

  console.log(" Seed terminé : 10 événements créés !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });