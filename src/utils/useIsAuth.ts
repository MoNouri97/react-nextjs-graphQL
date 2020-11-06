import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
	const router = useRouter();
	const [{ data, fetching }] = useMeQuery();

	useEffect(() => {
		if (!data?.me && !fetching) {
			router.replace(`/login?next=${router.pathname}`);
			console.log(router);
		}
	}, [data, fetching, router]);
};
