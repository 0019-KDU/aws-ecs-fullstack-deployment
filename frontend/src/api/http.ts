import axios, { AxiosError } from 'axios';
import type { ProblemDetail } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

export class ApiError extends Error {
  readonly status: number;
  readonly detail?: string;
  readonly fieldErrors?: Record<string, string>;

  constructor(problem: ProblemDetail) {
    super(problem.title || 'Request failed');
    this.status = problem.status;
    this.detail = problem.detail;
    this.fieldErrors = problem.errors;
  }
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetail>) => {
    if (error.response?.data) {
      return Promise.reject(new ApiError(error.response.data));
    }
    return Promise.reject(
      new ApiError({
        title: error.message || 'Network error',
        status: error.response?.status ?? 0,
      }),
    );
  },
);
