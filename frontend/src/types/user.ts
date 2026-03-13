export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'USER';
}

export interface LoginResponse {
  message?: string;
  token?: string;
  data: {
    user: User;
    token?: string;
  };
  user?: User; 
}