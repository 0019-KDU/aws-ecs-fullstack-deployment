import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentsApi, type ListParams } from '../api/students';
import type { StudentRequest } from '../api/types';

const KEYS = {
  all: ['students'] as const,
  list: (params: ListParams) => [...KEYS.all, 'list', params] as const,
  detail: (id: number) => [...KEYS.all, 'detail', id] as const,
};

export function useStudentsList(params: ListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => studentsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useStudent(id: number | undefined) {
  return useQuery({
    queryKey: id ? KEYS.detail(id) : ['students', 'detail', 'noop'],
    queryFn: () => studentsApi.get(id as number),
    enabled: typeof id === 'number',
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StudentRequest) => studentsApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateStudent(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: StudentRequest) => studentsApi.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
