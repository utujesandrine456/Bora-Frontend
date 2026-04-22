import { apiClient } from './client';

export const uploadsApi = {
  uploadCsv: async (file: File, jobId: string): Promise<unknown> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId); // Include in body as well

    const response = await apiClient.post(`/v1/upload/csv?jobId=${jobId}`, formData);
    return response.data;
  },

  uploadResume: async (file: File): Promise<unknown> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/v1/upload/resume', formData);
    return response.data;
  }
};
