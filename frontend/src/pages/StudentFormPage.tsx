import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/http';
import {
  useCreateStudent,
  useStudent,
  useUpdateStudent,
} from '../hooks/useStudents';
import type { StudentRequest } from '../api/types';

interface Props {
  mode: 'create' | 'edit';
}

type FormValues = StudentRequest;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENROLLMENT_REGEX = /^[A-Za-z0-9-]+$/;

export default function StudentFormPage({ mode }: Props) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const studentId = mode === 'edit' && id ? Number(id) : undefined;

  const { data: existing, isLoading: loadingExisting } = useStudent(studentId);
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent(studentId ?? 0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      enrollmentNumber: '',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        firstName: existing.firstName,
        lastName: existing.lastName,
        email: existing.email,
        dateOfBirth: existing.dateOfBirth ?? '',
        enrollmentNumber: existing.enrollmentNumber,
      });
    }
  }, [existing, reset]);

  const onSubmit = async (values: FormValues) => {
    const payload: StudentRequest = {
      ...values,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth : null,
    };

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(payload);
      } else if (studentId) {
        await updateMutation.mutateAsync(payload);
      }
      navigate('/students');
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msg]) => {
          setError(field as keyof FormValues, { type: 'server', message: msg });
        });
      } else if (err instanceof ApiError) {
        alert(err.detail ?? err.message);
      } else {
        alert('Save failed');
      }
    }
  };

  if (mode === 'edit' && loadingExisting) return <p>Loading…</p>;

  return (
    <section className="page">
      <div className="page__header">
        <h1>{mode === 'create' ? 'Add Student' : 'Edit Student'}</h1>
      </div>

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form__row">
          <label className="form__field">
            <span>First name *</span>
            <input
              type="text"
              {...register('firstName', {
                required: 'First name is required',
                maxLength: { value: 60, message: 'Max 60 characters' },
              })}
              aria-invalid={errors.firstName ? 'true' : 'false'}
            />
            {errors.firstName && <small className="error">{errors.firstName.message}</small>}
          </label>

          <label className="form__field">
            <span>Last name *</span>
            <input
              type="text"
              {...register('lastName', {
                required: 'Last name is required',
                maxLength: { value: 60, message: 'Max 60 characters' },
              })}
              aria-invalid={errors.lastName ? 'true' : 'false'}
            />
            {errors.lastName && <small className="error">{errors.lastName.message}</small>}
          </label>
        </div>

        <label className="form__field">
          <span>Email *</span>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: EMAIL_REGEX, message: 'Must be a valid email' },
              maxLength: { value: 120, message: 'Max 120 characters' },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <small className="error">{errors.email.message}</small>}
        </label>

        <div className="form__row">
          <label className="form__field">
            <span>Enrollment number *</span>
            <input
              type="text"
              {...register('enrollmentNumber', {
                required: 'Enrollment number is required',
                pattern: {
                  value: ENROLLMENT_REGEX,
                  message: 'Only letters, digits and dashes',
                },
                maxLength: { value: 30, message: 'Max 30 characters' },
              })}
              aria-invalid={errors.enrollmentNumber ? 'true' : 'false'}
            />
            {errors.enrollmentNumber && (
              <small className="error">{errors.enrollmentNumber.message}</small>
            )}
          </label>

          <label className="form__field">
            <span>Date of birth</span>
            <input
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              {...register('dateOfBirth')}
            />
          </label>
        </div>

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {mode === 'create' ? 'Create' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
