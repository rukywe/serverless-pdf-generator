import Joi from 'joi';

export const pdfRequestSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should not exceed {#limit} characters',
    'any.required': 'Name is required'
  }),

  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  message: Joi.string().required().min(10).max(1000).messages({
    'string.empty': 'Message cannot be empty',
    'string.min': 'Message should have at least {#limit} characters',
    'string.max': 'Message should not exceed {#limit} characters',
    'any.required': 'Message is required'
  }),

  fontSize: Joi.number().optional().min(8).max(72).default(12).messages({
    'number.base': 'Font size must be a number',
    'number.min': 'Font size should be at least {#limit}',
    'number.max': 'Font size should not exceed {#limit}'
  }),

  color: Joi.string()
    .optional()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .default('#000000')
    .messages({
      'string.pattern.base':
        'Color should be a valid hex color code (e.g., #FF0000)'
    })
});
