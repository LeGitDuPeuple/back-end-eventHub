import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../../domain/interface/userRepositoryInterface";
import { getEnvVariable } from "../../../Api/utils/getEnvVariable";

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: any) {

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new Error("Identifiants invalides");

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Identifiants invalides");

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      getEnvVariable("JWT_SECRET"),
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }
    };
  }
}