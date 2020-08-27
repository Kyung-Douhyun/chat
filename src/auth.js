import { AuthenticationError } from 'apollo-server-express';
import { User } from './models';
import { SESS_NAME } from './config';

const signedIn = req => req.session.userId;

export const attemptsignIn = async (email, password) => {
	const message =
		'Incorrect email or password. Please try again.';
	const user = await User.findOne({ email });
	if (!user) {
		throw new AuthenticationError(message);
	}

	if (!(await user.matchesPassword(password))) {
		throw new AuthenticationError(message);
	}

	return user;
};

export const checkSignedIn = req => {
	if (!signedIn(req)) {
		throw new AuthenticationError('You must be signed in.');
	}
};
export const checkSignedOut = req => {
	if (signedIn(req)) {
		throw new AuthenticationError(
			'You are already signed in.',
		);
	}
};

export const signOut = res =>
	new Promise((resolve, reject) => {
		req.session.destory(err => {
			if (err) reject(err);
			res.clearCookie(SESS_NAME);
			resolve(true);
		});
	});
