import { RegisterRequest, RegisterResponse } from '../interface/RegisterInterface';

const API_BASE_URL = 'https://recersis-api.onrender.com/api';

export default async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/guest/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error inesperado durante el registro');
  }
}
