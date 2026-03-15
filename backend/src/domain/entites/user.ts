
export class User {
  id: string;
  email: string;
  passwordHash: string;
  firstname?: string;
  lastname: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    email: string;
    passwordHash: string;
    firstname?: string;
    lastname: string;
    role:string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.firstname = params.firstname;
    this.lastname = params.lastname;
    this.role = params.role;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  validateOrThrow() {
    if (!this.email) {
      throw new Error('Email is required');
    }
    if (!this.passwordHash) {
      throw new Error('Password is required');
    }
    if(!this.firstname) {
      throw new Error('FisrtName is required')
    }
    if (!this.lastname) {
      throw new Error('Lastname is required');
    }
  }
}