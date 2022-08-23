import Joi, { SchemaMap } from '@hapi/joi';

export const signUpSchema: SchemaMap = {
  body: {
    full_name: Joi.string()
      .min(3)
      .max(100)
      .optional(),

    first_name: Joi.string()
      .min(3)
      .max(100)
      .required(),

    last_name: Joi.string()
      .min(3)
      .max(100)
      .required(),

    email: Joi.string()
      .pattern(new RegExp('^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$'))
      .required(),

    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"))
      .required()
  }
}