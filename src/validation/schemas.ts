import Joi from 'joi';

export const pdfRequestSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().required().email(),
  message: Joi.string().required().min(10).max(1000)
});
