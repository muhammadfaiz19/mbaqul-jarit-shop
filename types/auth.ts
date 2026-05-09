export interface Admin {
  id: number;
  email: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
}
