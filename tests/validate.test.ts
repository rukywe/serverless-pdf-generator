import Joi from 'joi';
import { validate, CustomValidationError } from '../src/utils/validate';

describe('validate utility', () => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(0).required()
  });

  it('should validate correct data', () => {
    const data = { name: 'John', age: 30 };
    expect(() => validate(schema, data)).not.toThrow();
  });

  it('should throw CustomValidationError for invalid data', () => {
    const data = { name: 'John', age: -1 };
    expect(() => validate(schema, data)).toThrow(CustomValidationError);
  });
});
