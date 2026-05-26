export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  enrollmentNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  enrollmentNumber: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string>;
  timestamp?: string;
}
