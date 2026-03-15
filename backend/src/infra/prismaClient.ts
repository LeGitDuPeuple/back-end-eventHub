import { PrismaClient } from "@prisma/client";

// On crée l'instance qui va nous permettre de parler à la DB
const prisma = new PrismaClient();

export default prisma;