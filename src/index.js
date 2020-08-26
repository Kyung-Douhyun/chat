import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import {
	APP_PORT,
	IN_PROD,
	DB_USERNAME,
	DB_PASSWORD,
	DB_HOST,
	DB_NAME,
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

		const server = new ApolloServer({
			typeDefs,
			resolvers,
			playground: !IN_PROD,
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
