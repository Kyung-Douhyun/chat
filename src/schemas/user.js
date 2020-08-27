import Joi from 'joi';

const email = Joi.string()
	.email()
	.required()
	.label('Email')
	.messages({
		'string.empty': `'email' cannot be an empty filed`,
	});
const username = Joi.string()
	.alphanum()
	.min(4)
	.max(30)
	.required()
	.label('Username')
	.messages({
		'string.empty': `'username' cannot be an empty filed`,
	});
const name = Joi.string()
	.max(254)
	.required()
	.label('Name')
	.messages({
		'string.empty': `'name' cannot be an empty filed`,
	});
const password = Joi.string()
	.min(8)
	.max(30)
	.regex(
		/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/,
	)
	.label('Password')
	.messages({
		'string.empty': `'password' cannot be an empty filed`,
	});

export const signUp = Joi.object({
	email,
	username,
	name,
	password,
});

export const signIn = Joi.object({
	email,
	password,
});
