import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import { BCRYPT_SALT } from '../config';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			validate: {
				validator: async email =>
					await User.doesntExist({ email }),
				message: ({ value }) =>
					`Email ${value} has already been taken.`,
			},
		},
		username: {
			type: String,
			validate: {
				validator: async username =>
					await User.doesntExist({ username }),
				message: ({ value }) =>
					`Username ${value} has already been taken.`,
			},
		},
		name: String,
		password: String,
	},
	{ timestamps: true },
);

userSchema.pre('save', async function () {
	if (this.isModified('password')) {
		this.password = await hash(this.password, BCRYPT_SALT);
	}
}); // hook , create가 작동 시 pre가 작동

userSchema.statics.doesntExist = async function (options) {
	return (await this.where(options).countDocuments()) === 0;
};

const User = mongoose.model('User', userSchema);

export default User;
