import { apiClient } from './client';

export interface JobAnalytics {
    jobId: string;
    totalCandidates: number;
    averageScore: number;
    topCandidate: {
        _id: string;
        firstName: string;
        lastName: string;
        matchScore: number;
    } | null;
    insights?: {
        matchQualityTrend: string;
        efficiencyRate: number;
        optimizationAdvice: string;
    };
}

export const analyticsApi = {
    /**
     * Get screening analytics and insights for a job
     * GET /api/v1/analytics/{jobId}
     */
    getJobAnalytics: async (jobId: string): Promise<JobAnalytics> => {
        const response = await apiClient.get<JobAnalytics>(`/v1/analytics/${jobId}`);
        return response.data;
    }
};
