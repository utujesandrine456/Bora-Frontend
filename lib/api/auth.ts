import { apiClient } from './client';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    const raw = response.data as any;

    console.log('[authApi.login] Raw response data:', raw);

    let token = raw.token || raw.accessToken || raw.access_token;

    if (token && typeof token === 'object' && token.accessToken) {
      token = token.accessToken;
    }

    if (!token) {
      console.warn('[authApi.login] No token found in response');
      return response.data;
    }

    const cleanToken =
      typeof token === 'string'
        ? token.trim().replace(/^["']|["']$/g, '')
        : '';

    if (typeof window !== 'undefined' && cleanToken) {
      localStorage.setItem('token', cleanToken);

      const loggedInUser = raw?.user;

      if (loggedInUser) {
        const photoKey = `bora_photo_${loggedInUser.email || loggedInUser.id || (loggedInUser as any)._id}`;
        const savedPhoto = localStorage.getItem(photoKey);

        const userWithPhoto = savedPhoto
          ? {
              ...loggedInUser,
              id: loggedInUser.id || (loggedInUser as any)._id,
              photo: savedPhoto
            }
          : {
              ...loggedInUser,
              id: loggedInUser.id || (loggedInUser as any)._id
            };

        localStorage.setItem('user', JSON.stringify(userWithPhoto));
        console.log('User stored with photo restoration:', !!savedPhoto);
      }

      console.log(
        '[authApi.login] Token stored successfully. Preview:',
        cleanToken.substring(0, 16) + '...'
      );
    }

    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/v1/auth/logout');
    } catch (error) {
      console.error('[authApi.logout] Logout API call failed (non-critical):', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get('/v1/auth/me');
    return response.data;
  },

  /**
   * Change password for the currently logged-in user.
   * Uses internal API route.
   */
  changePassword: async (newPassword: string): Promise<{ message: string }> => {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return response.json();
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/v1/auth/forgot-password',
      data
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/v1/auth/reset-password',
      data
    );
    return response.data;
  }
};