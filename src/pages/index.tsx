import { Link, Text } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';

import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

const Index = () => {
	const [{ data }] = usePostsQuery();
	return (
		<Layout variant='small'>
			<Text fontSize='6xl'>Index</Text>
			<NextLink href='/create-post'>
				<Link>create post</Link>
			</NextLink>
			{!data
				? 'loading'
				: data.posts.map(post => <h1 key={post.id}>{post.title}</h1>)}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
