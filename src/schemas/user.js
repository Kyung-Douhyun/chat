import Joi from 'joi';

export default Joi.object({
	email: Joi.string()
		.email()
		.required()
		.label('Email')
		.messages({
			'string.empty': `'email' cannot be an empty filed`,
		}),
	username: Joi.string()
		.alphanum()
		.min(4)
		.max(30)
		.required()
		.label('Username')
		.messages({
			'string.empty': `'username' cannot be an empty filed`,
		}),
	name: Joi.string()
		.max(254)
		.required()
		.label('Name')
		.messages({
			'string.empty': `'name' cannot be an empty filed`,
		}),
	password: Joi.string()
		.regex(
			/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/,
		)
		.label('Password')
		.messages({
			'string.empty': `'password' cannot be an empty filed`,
		}),
});
