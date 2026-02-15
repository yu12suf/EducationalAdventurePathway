import api from './api';
import { Scholarship } from '@/types/scholarship';

export const scholarshipService = {
  // Get scholarships with optional filters and studentId
  getScholarships: async (params?: Record<string, any>) => {
    const response = await api.get('/api/scholarships', { params });
    return response.data;
  },

  // Get a single scholarship by ID
  getScholarshipById: async (id: string, studentId?: string) => {
    const params = studentId ? { studentId } : {};
    const response = await api.get(`/api/scholarships/${id}`, { params });
    return response.data;
  },

  // Save a scholarship for the current student
  saveScholarship: async (scholarshipId: string) => {
    const response = await api.post(`/api/scholarships/${scholarshipId}/save`);
    return response.data;
  },

  // Unsave a scholarship
  unsaveScholarship: async (scholarshipId: string) => {
    const response = await api.delete(`/api/scholarships/${scholarshipId}/save`);
    return response.data;
  },

  // Get saved scholarships for the current student
  getSavedScholarships: async () => {
    const response = await api.get('/api/scholarships/saved');
    return response.data;
  },
};