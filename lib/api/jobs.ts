import { apiClient } from './client';
import { Job } from './types';
import { saveLocalJob, mergeWithLocalJobs } from '../localJobsStore';

export const jobsApi = {
  createJob: async (data: Partial<Job>): Promise<Job> => {
    console.log('[API Jobs] Creating job with data:', data);

    try {
      const response = await apiClient.post<Job>('/v1/jobs', data);
      const created = response.data;

      const backendJob = (created as any)?.data || (created as any)?.job || created;

      // Persist locally for instant UI sync
      if (backendJob) {
        saveLocalJob({
          id: backendJob._id || backendJob.id || `local-${Date.now()}`,
          title: data.title || '',
          company: data.company || '',
          location: data.location || '',
          type: data.type || 'full-time',
          status: data.status || 'open',
          description: data.description || '',
          skills: data.skills || [],
          requirements: data.requirements || [],
          experienceYears: data.experienceYears || 0,
          createdAt: backendJob.createdAt || new Date().toISOString(),
          updatedAt: backendJob.updatedAt || new Date().toISOString(),
        });
      }

      return created;
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.error(
          '[API Jobs] 400 Bad Request Payload:',
          JSON.stringify(data, null, 2)
        );
        console.error(
          '[API Jobs] 400 Bad Request Response:',
          JSON.stringify(error.response?.data, null, 2)
        );
      }
      throw error;
    }
  },

  getJobs: async (): Promise<Job[]> => {
    type JobsResponse =
      | Job[]
      | { data?: Job[]; total?: number; length?: number; [key: string]: unknown };

    const response = await apiClient.get<JobsResponse>('/v1/jobs');
    let rawData: JobsResponse = response.data;

    if (
      !rawData ||
      (Array.isArray((rawData as any).data) &&
        (rawData as any).total === 0 &&
        (rawData as any).data?.length === 0)
    ) {
      try {
        const resp2 = await apiClient.get<JobsResponse>('/v1/jobs?status=all');
        if (resp2.data) rawData = resp2.data;
      } catch (_e) {}
    }

    if (typeof window !== 'undefined') {
      (window as any).__LAST_JOBS_API_RESPONSE__ = rawData;
      (window as any).__LAST_JOBS_API_STATUS__ = response.status;
    }

    const findArray = (obj: unknown): unknown[] | null => {
      if (Array.isArray(obj)) return obj;

      if (obj && typeof obj === 'object') {
        const priorityKeys = ['jobs', 'data', 'items', 'results', 'list'];

        for (const key of priorityKeys) {
          if (Array.isArray((obj as any)[key])) return (obj as any)[key];
        }

        for (const key in obj as any) {
          const val = (obj as any)[key];
          if (Array.isArray(val)) return val;

          if (val && typeof val === 'object') {
            for (const subKey in val) {
              if (Array.isArray(val[subKey])) return val[subKey];
            }
          }
        }
      }

      return null;
    };

    const jobsArray = findArray(rawData) || [];
    return mergeWithLocalJobs(jobsArray) as Job[];
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/v1/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<Job> => {
    const response = await apiClient.put<Job>(`/v1/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/jobs/${id}`);
  }
};