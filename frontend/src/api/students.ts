import { http } from './http';
import type { PageResponse, Student, StudentRequest } from './types';

export interface ListParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export const studentsApi = {
  list: async (params: ListParams = {}): Promise<PageResponse<Student>> => {
    const { data } = await http.get<PageResponse<Student>>('/students', { params });
    return data;
  },

  get: async (id: number): Promise<Student> => {
    const { data } = await http.get<Student>(`/students/${id}`);
    return data;
  },

  create: async (body: StudentRequest): Promise<Student> => {
    const { data } = await http.post<Student>('/students', body);
    return data;
  },

  update: async (id: number, body: StudentRequest): Promise<Student> => {
    const { data } = await http.put<Student>(`/students/${id}`, body);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await http.delete(`/students/${id}`);
  },
};
