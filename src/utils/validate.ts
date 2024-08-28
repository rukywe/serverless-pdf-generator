import { Schema } from 'joi';

export class CustomValidationError extends Error {
  constructor(public details: { [key: string]: string }) {
    super('Validation error');
    this.name = 'CustomValidationError';
  }
}

export const validate = <T>(schema: Schema, data: unknown): T => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errorDetails: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      errorDetails[detail.path.join('.')] = detail.message;
    });
    throw new CustomValidationError(errorDetails);
  }
  return value as T;
};
