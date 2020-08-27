import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import redis from 'redis';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import {
	APP_PORT,
	IN_PROD,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_NAME,
	SESS_NAME,
	SESS_SECRET,
	SESS_LIFETIME,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASSWORD,
} from './config';

(async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		);

		const app = express();

		app.disable('x-powered-by'); // 서버의 종류를 헤더에서 제거 ( 보안상의 이유 )

		const RedisStore = connectRedis(session);
		const RedisClient = redis.createClient();
		const store = new RedisStore({
			client: RedisClient,
			host: REDIS_HOST,
			port: REDIS_PORT,
			pass: REDIS_PASSWORD,
		});
		app.use(cookieParser());
		app.set('trust proxy', 1);
		app.use(
			session({
				store,
				name: SESS_NAME,
				secret: SESS_SECRET,
				resave: false,
				saveUninitialized: true,
				cookie: {
					maxAge: SESS_LIFETIME,
					smaeSite: true,
					// secure: true,
					httpOnly: false,
				},
			}),
		);

		// app.use(
		// 	session({
		// 		secret: 'secretKey',
		// 		resave: false,
		// 		saveUninitialized: true,
		// 	}),
		// );

		RedisClient.on('error', function (err) {
			console.log('Redis error: ' + err);
		});

		RedisClient.on('ready', function () {
			console.log('Redis is ready');
		});

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			cors: false,
			playground: IN_PROD
				? false
				: {
						settings: {
							'request.credentials': 'include',
						},
				  },
			context: ({ req, res }) => ({ req, res }),
		});

		server.applyMiddleware({ app });

		app.listen({ port: APP_PORT }, () =>
			console.log(
				`🚀 Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`,
			),
		);
	} catch (e) {
		console.error(e);
	}
})();
