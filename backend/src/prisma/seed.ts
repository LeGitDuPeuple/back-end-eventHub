import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction qui permet de créer un jeux de données
async function main() {
  await prisma.event.createMany({
    data: [
      {
        title: "Concert Jul",
        description: "Un concert de Jul en live",
        startDate: new Date("2026-03-01T20:00:00.000Z"),
        location: "Paris",
        capacity: 150,
        price: 25,
      },
      {
        title: "Conférence Tech",
        description: "Conférence autour du cloud et DevOps",
        startDate: new Date("2026-04-10T09:00:00.000Z"),
        location: "Lyon",
        capacity: 300,
        price: 0,
      },
      {
        title: "Meetup Startup",
        description: "Rencontre entre entrepreneurs",
        startDate: new Date("2026-05-05T18:30:00.000Z"),
        location: "Marseille",
        capacity: 80,
        price: 10,
      },
    ],
  });

  console.log("✅ Seed terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
