import { Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';

import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<>
			<Navbar />
			<Text fontSize='6xl'>Index</Text>
			{!data ? 'loading' : data.posts.map(post => <h1>{post.title}</h1>)}
		</>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
