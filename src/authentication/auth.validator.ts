import Joi from 'joi';

const validator = (schema: Joi.ObjectSchema) => (payload: Joi.ObjectSchema) =>
	schema.validate(payload);

const signupSchema = {
	username: Joi.string().min(3).max(30).required(),
};

const signupValidator = validator(Joi.object(signupSchema));

export { signupValidator };
