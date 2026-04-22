import { apiClient } from './client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    const raw = response.data as Record<string, unknown>;

    console.log('[authApi.login] Raw response data:', raw);

    // Extract token from any common backend shape:
    //   { token }  |  { accessToken }  |  { access_token }
    //   { data: { token } }  |  { data: { accessToken } }
    const nested = (raw?.data ?? {}) as Record<string, unknown>;
    const token =
      (raw?.token as string) ||
      (raw?.accessToken as string) ||
      (raw?.access_token as string) ||
      (nested?.token as string) ||
      (nested?.accessToken as string) ||
      (nested?.access_token as string) ||
      null;

    if (!token || typeof token !== 'string') {
      console.error('[authApi.login] Token not found or not a string in response. Full response:', raw);
      throw new Error('Login succeeded but no auth token was returned. Please contact support.');
    }

    const cleanToken = token.trim().replace(/^["']|["']$/g, ''); // strip accidental quotes

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', cleanToken);

      // Store user info from wherever the backend puts it
      const user = raw?.user ?? nested?.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      console.log('[authApi.login] Token stored successfully. Preview:', cleanToken.substring(0, 16) + '...');
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
  }
};
