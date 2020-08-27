import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';
import { User } from '../models';
import { signUp, signIn } from '../schemas';
import * as Auth from '../auth';

export default {
	Query: {
		me: (root, args, { req }, info) => {
			Auth.checkSignedIn(req);
			return User.findById(req.session.userId);
		},
		users: (root, args, { req }, info) => {
			Auth.checkSignedIn(req);
			return User.find({});
		},
		user: (root, { id }, { req }, info) => {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new UserInputError(
					`${id} is not a valid user ID.`,
				);
			}

			return User.findById(id);
		},
	},

	Mutation: {
		signUp: async (root, args, { req }, info) => {
			Auth.checkSignedOut(req);
			await signUp.validateAsync(args, {
				abortEarly: false,
			});
			const user = await User.create(args);
			req.session.userId = user.id;
			return user;
		},

		signIn: async (root, args, { req }, info) => {
			const { userId } = req.session;

			if (userId) {
				return User.findById(userId);
			}
			await signIn.validateAsync(args, {
				aboutEarly: false,
			});
			const user = await Auth.attemptsignIn(
				args.email,
				args.password,
			);

			req.session.userId = user.id;

			return user;
		},

		signOut: (root, args, { req, res }, info) => {
			Auth.checkSignedIn(req);
			return Auth.signOut(req, res);
		},
	},
};
