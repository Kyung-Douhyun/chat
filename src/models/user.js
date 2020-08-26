import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import { BCRYPT_SALT } from '../config';

const userSchema = new mongoose.Schema(
	{
		email: String,
		username: String,
		name: String,
		password: String,
	},
	{ timestamps: true },
);

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		try {
			this.password = await hash(
				this.password,
				BCRYPT_SALT,
			);
		} catch (err) {
			next(err);
		}
	}
	next();
}); // hook , create가 작동 시 pre가 작동

export default mongoose.model('user', userSchema);
