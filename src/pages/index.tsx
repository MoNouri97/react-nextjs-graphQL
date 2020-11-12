import {
	Box,
	Button,
	Flex,
	Heading,
	Icon,
	Link,
	Stack,
	Text,
} from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';

import Navbar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';
import { useState } from 'react';
import Post from '../components/Post';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({ variables });

	if (!data && !fetching) return <Heading>!!! query error !!!</Heading>;

	return (
		<Layout variant='regular'>
			<Flex align='center'>
				<Heading>Fake Reddit</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'>create post</Link>
				</NextLink>
			</Flex>

			{!data ? (
				'loading'
			) : (
				<Stack spacing={10}>
					{data.posts.posts.map(post => (
						<Post key={post.id} post={post} />
					))}
				</Stack>
			)}
			{data && data.posts.hasMore && (
				<Flex my={8}>
					<Button
						isLoading={fetching}
						mx='auto'
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							});
						}}
					>
						Load more
					</Button>
				</Flex>
			)}
		</Layout>
	);
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
