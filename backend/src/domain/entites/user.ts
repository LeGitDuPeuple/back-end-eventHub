export class User {
  id: string;
  email: string;
  passwordHash: string;
  firstname?: string;
  lastname: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  
  // On ajoute les champs exacts de ton schéma Prisma
  otp_enable: number; 
  otp_secret?: string | null;
  recovery_codes?: string | null;

  constructor(params: {
    id: string;
    email: string;
    passwordHash: string;
    firstname?: string;
    lastname: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    // Ajout dans les paramètres du constructeur
    otp_enable?: number;
    otp_secret?: string | null;
    recovery_codes?: string | null;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.firstname = params.firstname;
    this.lastname = params.lastname;
    this.role = params.role;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    
    // Initialisation (avec valeur par défaut 0 pour enabled)
    this.otp_enable = params.otp_enable ?? 0;
    this.otp_secret = params.otp_secret;
    this.recovery_codes = params.recovery_codes;
  }

  validateOrThrow() {
    if (!this.email) throw new Error('Email is required');
    if (!this.passwordHash) throw new Error('Password is required');
    if (!this.lastname) throw new Error('Lastname is required');
    // On peut aussi valider que le secret est présent si l'OTP est activé
    if (this.otp_enable === 1 && !this.otp_secret) {
        throw new Error('OTP secret is required when OTP is enabled');
    }
  }
}