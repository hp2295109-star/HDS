import React, { useState, useEffect } from 'react';
import { validateForm, isCooldownActive, setCooldownTimestamp, ValidationErrors, sanitizeInput } from '../utils/validation';

interface UseSupabaseFormOptions<T> {
  formKey: string;
  initialValues: T;
  validateFields?: (keyof T)[];
  submitFn: (values: T) => Promise<{ success: boolean; error?: string }>;
  cooldownMs?: number;
  onSuccess?: () => void;
}

export function useSupabaseForm<T extends Record<string, any>>({
  formKey,
  initialValues,
  validateFields = [],
  submitFn,
  cooldownMs = 60000,
  onSuccess
}: UseSupabaseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Monitor and handle duplicate cooldown countdowns
  useEffect(() => {
    const checkCooldown = () => {
      const { active, remainingSeconds } = isCooldownActive(formKey, cooldownMs);
      if (active) {
        setCooldownRemaining(remainingSeconds);
      } else {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(() => {
      const { active, remainingSeconds } = isCooldownActive(formKey, cooldownMs);
      if (active) {
        setCooldownRemaining(remainingSeconds);
      } else {
        setCooldownRemaining(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [formKey, cooldownMs, isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let val: any = value;

    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    }

    setValues((prev) => ({
      ...prev,
      [name]: val
    }));

    // Clear specific field error when user starts editing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSuccess(false);
    setIsError(false);
    setStatusMessage('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // 1. Anti-spam / Cooldown validation
    const { active, remainingSeconds } = isCooldownActive(formKey, cooldownMs);
    if (active) {
      setIsError(true);
      setStatusMessage(`Please wait ${remainingSeconds} seconds before submitting again.`);
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setStatusMessage('');

    // 2. Field validation
    const validationPayload: Record<string, string> = {};
    validateFields.forEach((field) => {
      if (typeof values[field as string] === 'string') {
        validationPayload[field as string] = values[field as string];
      }
    });

    const formErrors = validateForm(validationPayload);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      setIsError(true);
      setStatusMessage('Please fix the validation errors before submitting.');
      return;
    }

    // 3. Sanitization
    const sanitizedValues = { ...values };
    Object.keys(sanitizedValues).forEach((key) => {
      if (typeof sanitizedValues[key] === 'string') {
        sanitizedValues[key as keyof T] = sanitizeInput(sanitizedValues[key]) as any;
      }
    });

    // 4. Submit to backend service
    try {
      const response = await submitFn(sanitizedValues);

      if (response.success) {
        setIsSuccess(true);
        setStatusMessage('Thank you! Your submission was successful.');
        setCooldownTimestamp(formKey);
        setValues(initialValues); // Reset values on success
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setIsError(true);
        setStatusMessage(response.error || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setIsError(true);
      setStatusMessage('Network failure. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    isLoading,
    isSuccess,
    isError,
    statusMessage,
    cooldownRemaining,
    handleChange,
    handleSubmit,
    resetForm
  };
}
