import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';
import { User } from '../models';

export default {
	Query: {
		users: (root, args, context, info) => {
			// TODO: auth(인증), projection(투사,투영), pagination(페이지 매기기)
			return User.find({});
		},
		user: (root, { id }, context, info) => {
			// TODO: auth, projection

			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(
					`${id} is not a valid user ID.`,
				);
			}

			return User.findById(id);
		},
	},

	Mutation: {
		signUp: (root, args, context, info) => {
			// TODO: not auth

			// validation

			return User.create(args);
		},
	},
};
