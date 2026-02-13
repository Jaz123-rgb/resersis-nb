export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  jobOccupation: string;
}

export interface RegisterResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobOccupation: string;
  createdAt: string;
  message?: string;
}

export interface RegisterError {
  message: string;
  field?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
