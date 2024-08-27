import { Schema } from 'joi';

export class CustomValidationError extends Error {
  constructor(public details: string[]) {
    super('Validation error');
    this.name = 'CustomValidationError';
  }
}

export const validate = <T>(schema: Schema, data: unknown): T => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    throw new CustomValidationError(
      error.details.map((detail) => detail.message)
    );
  }
  return value as T;
};
