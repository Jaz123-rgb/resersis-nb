export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  verified: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  };
}
