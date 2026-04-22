import { apiClient } from './client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    console.log('authApi.login response data:', response.data);

    type RawLoginData = { token?: string; accessToken?: string; access_token?: string };
    const raw = response.data as unknown as RawLoginData;
    let token = raw.token || raw.accessToken || raw.access_token;

    if (token && typeof token === 'object' && token.accessToken) {
      token = token.accessToken;
    }

    if (typeof token === 'string' && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      if (response.data.user) {
        const loggedInUser = response.data.user;
        // Restore any previously saved photo from the dedicated key (survives logout)
        const photoKey = `bora_photo_${loggedInUser.email || loggedInUser.id || (loggedInUser as any)._id}`;
        const savedPhoto = localStorage.getItem(photoKey);
        const userWithPhoto = savedPhoto
          ? { ...loggedInUser, id: loggedInUser.id || (loggedInUser as any)._id, photo: savedPhoto }
          : { ...loggedInUser, id: loggedInUser.id || (loggedInUser as any)._id };
        localStorage.setItem('user', JSON.stringify(userWithPhoto));
        console.log('User stored with photo restoration:', !!savedPhoto);
      }
      console.log('Token and user info successfully stored in localStorage');
    } else if (token) {
      console.error('Token found but it is not a string:', token);
    } else {
      console.warn('No token found in login response!', response.data);
    }

    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/v1/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
  }
};
