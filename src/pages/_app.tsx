import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { AppProps } from 'next/app';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { LoginMutation, MeDocument, MeQuery } from '../generated/graphql';

import theme from '../theme';
import { betterUpdateQuery } from '../utils/betterUpdateQuery';

const client = createClient({
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
				},
			},
		}),
		fetchExchange,
	],
});
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider value={client}>
			<ThemeProvider theme={theme}>
				<ColorModeProvider>
					<CSSReset />
					<Component {...pageProps} />
				</ColorModeProvider>
			</ThemeProvider>
		</Provider>
	);
}

export default MyApp;
