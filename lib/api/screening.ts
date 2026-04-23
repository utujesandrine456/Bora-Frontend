import { apiClient } from './client';
import { ScreeningResult } from './types';

export const screeningApi = {
  /**
   * POST /v1/screen/{jobId}
   * Queues AI screening for a job. Non-blocking — returns immediately.
   */
  triggerScreening: async (
    jobId: string
  ): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{
      message: string;
      status: string;
    }>(`/v1/screen/${jobId}`);

    return response.data;
  },

  /**
   * GET /v1/results/{jobId}
   * Returns screening results (handles multiple backend response shapes + optional versioning).
   */
  getResults: async (
    jobId: string,
    version?: number
  ): Promise<ScreeningResult[]> => {
    const query = version ? `?version=${version}` : '';
    const response = await apiClient.get<unknown>(
      `/v1/results/${jobId}${query}`
    );

    const raw = response.data;

    // Case 1: direct array
    if (Array.isArray(raw)) return raw as ScreeningResult[];

    // Case 2: wrapped response
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, any>;

      for (const key of ['data', 'results', 'candidates', 'items']) {
        if (Array.isArray(obj[key])) {
          return obj[key] as ScreeningResult[];
        }
      }
    }

    return [];
  },

  /**
   * GET /v1/results/{jobId}/versions
   * Lists all screening result versions for a job.
   */
  getResultVersions: async (
    jobId: string
  ): Promise<{ version: number; createdAt: string }[]> => {
    const response = await apiClient.get<unknown>(
      `/v1/results/${jobId}/versions`
    );

    const raw = response.data;

    // Case 1: direct array
    if (Array.isArray(raw)) {
      return raw as { version: number; createdAt: string }[];
    }

    // Case 2: wrapped response
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, any>;

      for (const key of ['data', 'versions', 'items']) {
        if (Array.isArray(obj[key])) {
          return obj[key] as { version: number; createdAt: string }[];
        }
      }
    }

    return [];
  }
};