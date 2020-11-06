import { cacheExchange } from '@urql/exchange-graphcache';
import { ClientOptions, dedupExchange, Exchange, fetchExchange } from 'urql';
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

// global way to catch error
const errorExchange: Exchange = ({ forward }) => ops$ => {
	return pipe(
		forward(ops$),
		tap(({ error }) => {
			if (error?.message.includes('not authenticated')) {
				Router.replace('/login');
			}
		}),
	);
};

/**
 * URQL has a custom integration with Next.js,
 * being next-urql this integration contains convenience methods specifically for Next.js.
 * These will simplify the setup for SSR.
 * @example
 * export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
 */
export const createUrqlClient = (ssrExchange: any): ClientOptions => ({
	url: 'http://localhost:4000/graphql',
	fetchOptions: {
		credentials: 'include',
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					login: (_result, args, cache, info) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(loginResult, queryData) => {
								if (loginResult.login.errors) {
									return queryData;
								} else {
									return {
										me: loginResult.login.user,
									};
								}
							},
						);
					},
					register: (_result, args, cache, info) => {
						betterUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							(loginResult, queryData) => {
								if (loginResult.register.errors) {
									return queryData;
								} else {
									return {
										me: loginResult.register.user,
									};
								}
							},
						);
					},
					logout: (_result, args, cache, info) => {
						betterUpdateQuery<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							_result,
							() => {
								return { me: null };
							},
						);
					},
				},
			},
		}),
		errorExchange,
		ssrExchange,
		fetchExchange,
	],
});
