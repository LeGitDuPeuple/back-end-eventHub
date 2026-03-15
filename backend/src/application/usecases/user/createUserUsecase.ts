import { UserRepository } from "../../../domain/interface/userRepositoryInterface";
import { CreateUserDto } from "../../dto/createUserDTO";
import { User } from "../../../domain/entites/user"; 
import bcrypt from "bcrypt";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto) {
    // On hash le password (on met une string vide si absent pour que validateOrThrow râle)
    const passwordHash = await bcrypt.hash(dto.password || "", 12);

    // 1. On crée l'instance (C'est là que le mot 'User' est utilisé)
    const userEntity = new User({
      id: "", 
      email: dto.email,
      passwordHash: passwordHash,
      firstname: dto.firstname,
      lastname: dto.lastname,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 2. ON VALIDE (Si dto.password était vide, ça va crash ici)
    userEntity.validateOrThrow();

    // 3. On envoie l'entité validée au repo
    return this.userRepository.create(userEntity);
  }
}