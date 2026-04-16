import api from '@/lib/axios';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  status: string;
  data: {
    token: string;
  };
  meta: {
    timestamp: string;
  };
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },
};
