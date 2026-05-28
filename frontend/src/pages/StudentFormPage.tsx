import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../api/http';
import { useCreateStudent, useStudent, useUpdateStudent } from '../hooks/useStudents';
import type { StudentRequest } from '../api/types';

interface Props { mode: 'create' | 'edit'; }
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
    defaultValues: { firstName: '', lastName: '', email: '', dateOfBirth: '', enrollmentNumber: '' },
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
    const payload: StudentRequest = { ...values, dateOfBirth: values.dateOfBirth || null };
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(payload);
      } else if (studentId) {
        await updateMutation.mutateAsync(payload);
      }
      navigate('/students');
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msg]) =>
          setError(field as keyof FormValues, { type: 'server', message: msg })
        );
      } else if (err instanceof ApiError) {
        alert(err.detail ?? err.message);
      } else {
        alert('Save failed');
      }
    }
  };

  if (mode === 'edit' && loadingExisting) return <div className="spinner">Loading student…</div>;

  return (
    <div className="card" style={{ maxWidth: 680 }}>
      <div className="card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 'var(--radius-sm)',
            background: 'var(--indigo-50)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
          }}>
            {mode === 'create' ? '➕' : '✏️'}
          </div>
          <div>
            <div className="card__title">
              {mode === 'create' ? 'Add New Student' : 'Edit Student'}
            </div>
            <div style={{ fontSize: '.75rem', color: 'var(--color-muted)', marginTop: '.1rem' }}>
              {mode === 'create'
                ? 'Fill in the details to register a new student'
                : 'Update the student information below'}
            </div>
          </div>
        </div>
      </div>

      <form className="card__body" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          {/* First name */}
          <div className="field">
            <label className="field__label">
              First name<span className="field__required">*</span>
            </label>
            <input
              className="field__input"
              type="text"
              placeholder="e.g. John"
              {...register('firstName', {
                required: 'First name is required',
                maxLength: { value: 60, message: 'Max 60 characters' },
              })}
              aria-invalid={errors.firstName ? 'true' : 'false'}
            />
            {errors.firstName && <span className="field__error">⚠ {errors.firstName.message}</span>}
          </div>

          {/* Last name */}
          <div className="field">
            <label className="field__label">
              Last name<span className="field__required">*</span>
            </label>
            <input
              className="field__input"
              type="text"
              placeholder="e.g. Doe"
              {...register('lastName', {
                required: 'Last name is required',
                maxLength: { value: 60, message: 'Max 60 characters' },
              })}
              aria-invalid={errors.lastName ? 'true' : 'false'}
            />
            {errors.lastName && <span className="field__error">⚠ {errors.lastName.message}</span>}
          </div>

          {/* Email */}
          <div className="field form-grid--full">
            <label className="field__label">
              Email address<span className="field__required">*</span>
            </label>
            <input
              className="field__input"
              type="email"
              placeholder="e.g. john.doe@university.edu"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: EMAIL_REGEX, message: 'Must be a valid email' },
                maxLength: { value: 120, message: 'Max 120 characters' },
              })}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <span className="field__error">⚠ {errors.email.message}</span>}
          </div>

          {/* Enrollment number */}
          <div className="field">
            <label className="field__label">
              Enrollment number<span className="field__required">*</span>
            </label>
            <input
              className="field__input"
              type="text"
              placeholder="e.g. STU-2024-001"
              {...register('enrollmentNumber', {
                required: 'Enrollment number is required',
                pattern: { value: ENROLLMENT_REGEX, message: 'Only letters, digits and dashes' },
                maxLength: { value: 30, message: 'Max 30 characters' },
              })}
              aria-invalid={errors.enrollmentNumber ? 'true' : 'false'}
            />
            {errors.enrollmentNumber && (
              <span className="field__error">⚠ {errors.enrollmentNumber.message}</span>
            )}
          </div>

          {/* Date of birth */}
          <div className="field">
            <label className="field__label">Date of birth</label>
            <input
              className="field__input"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              {...register('dateOfBirth')}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create Student' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
