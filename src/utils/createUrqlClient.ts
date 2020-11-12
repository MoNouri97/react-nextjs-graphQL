import {
	cacheExchange,
	Data,
	ResolveInfo,
	Resolver,
	Variables,
	Cache,
} from '@urql/exchange-graphcache';
import {
	ClientOptions,
	dedupExchange,
	Exchange,
	fetchExchange,
	stringifyVariables,
} from 'urql';
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
import { NextUrqlContext } from 'next-urql';
import { isServer } from './isServer';

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
// this is madness but is the only way in urql , i think
const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		// fieldName = posts (query name)
		// entityKey = Query
		const { parentKey: entityKey, fieldName } = info;
		// get all queries in the cache
		const allFields = cache.inspectFields(entityKey);
		// only get cached posts queries (each set of arguments is a new query)
		const fieldInfos = allFields.filter(field => field.fieldName == fieldName);
		const size = fieldInfos.length;
		if (size === 0) return undefined;

		const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
		const isInTheCache = cache.resolve(
			cache.resolveFieldByKey(entityKey, fieldKey) as string,
			'posts',
		);
		info.partial = !isInTheCache;

		// concat all cached results
		const results = {
			__typename: 'PaginatedPosts',
			posts: [] as string[],
			hasMore: true,
		};
		fieldInfos.forEach(info => {
			const key = cache.resolveFieldByKey(entityKey, info.fieldKey) as string;
			const data = cache.resolve(key, 'posts') as string[];
			const more = cache.resolve(key, 'hasMore') as boolean;

			results.hasMore = results.hasMore && more;
			results.posts.push(...data);
		});

		return results;
	};
};

// forces URQL to re-fetch a query
const invalidateQueryCache = (query: string) => {
	return (_result: Data, args: Variables, cache: Cache, info: ResolveInfo) => {
		// same as cursor pagination
		const allFields = cache.inspectFields('Query');
		const fieldInfos = allFields.filter(field => field.fieldName == query);
		fieldInfos.forEach(fi => {
			cache.invalidate('Query', query, fi.arguments || {});
		});
	};
};

/**
 * URQL has a custom integration with Next.js,
 * being next-urql this integration contains convenience methods specifically for Next.js.
 * These will simplify the setup for SSR.
 * @example
 * export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
 */
export const createUrqlClient = (ssrExchange: any, ctx: any): ClientOptions => {
	// to pass the cookie when using ssr
	let cookie;
	if (isServer()) {
		cookie = ctx.req.headers.cookie;
	}
	return {
		url: 'http://localhost:4000/graphql',
		fetchOptions: {
			credentials: 'include',
			headers: cookie ? { cookie } : undefined,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				resolvers: {
					Query: {
						posts: cursorPagination(),
					},
				},
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
						createPost: invalidateQueryCache('posts'),
						vote: invalidateQueryCache('posts'),
					},
				},
			}),
			errorExchange,
			ssrExchange,
			fetchExchange,
		],
	};
};
