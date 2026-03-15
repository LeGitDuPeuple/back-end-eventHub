import { PrismaClient, Role } from "@prisma/client"; // Importe Role depuis Prisma
import { User } from "../../domain/entites/user";
import { UserRepository } from "../../domain/interface/userRepositoryInterface"; 

const prisma = new PrismaClient();

export class UserRepositoryDatabase implements UserRepository {
  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        // On transforme le null potentiel en undefined pour Prisma
        firstname: user.firstname ?? undefined, 
        lastname: user.lastname,
        // On force le type vers l'Enum attendu par Prisma
        role: user.role as Role, 
      },
    });

    return new User({
      id: created.id,
      email: created.email,
      passwordHash: created.passwordHash,
      firstname: created.firstname ?? undefined, 
      lastname: created.lastname,
      role: created.role,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }


  async findByEmail(email: string): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { email },
    });

    if (!found) return null;

    return new User({
      id: found.id,
      email: found.email,
      passwordHash: found.passwordHash,
      firstname: found.firstname ?? undefined,
      lastname: found.lastname,
      role: found.role,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    });
  }
}