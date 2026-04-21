import { apiClient } from './client';
import { Job } from './types';
import { saveLocalJob, mergeWithLocalJobs } from '../localJobsStore';

export const jobsApi = {
  createJob: async (data: any): Promise<Job> => {
    const response = await apiClient.post<any>('/v1/jobs', data);
    const created = response.data;

    // Immediately persist to local store so it appears in the portal
    // even if backend isn't returning it yet in list queries
    const backendJob = (created as any)?.data || (created as any)?.job || created;
    if (backendJob) {
      saveLocalJob({
        id: backendJob._id || backendJob.id || `local-${Date.now()}`,
        title: data.title,
        company: data.company,
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

    return response.data;
  },

  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<any>('/v1/jobs');
    // Extreme resilience: check all common data wrappers
    const rawData = response.data;
    let apiJobs: any[] = [];
    if (Array.isArray(rawData)) apiJobs = rawData;
    else if (Array.isArray(rawData?.data)) apiJobs = rawData.data;
    else if (Array.isArray(rawData?.jobs)) apiJobs = rawData.jobs;
    else if (Array.isArray(rawData?.results)) apiJobs = rawData.results;
    else if (Array.isArray(rawData?.items)) apiJobs = rawData.items;

    // Merge with locally stored jobs to fill any backend sync gap
    return mergeWithLocalJobs(apiJobs) as Job[];
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
