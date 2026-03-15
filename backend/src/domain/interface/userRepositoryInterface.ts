import { User } from "../entites/user";

export interface UserRepository {
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
    findByEmail(email: string): Promise<User | null>; 
}
