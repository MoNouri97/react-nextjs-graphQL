import { Box, Flex, Heading, Text, IconButton } from '@chakra-ui/core';
import React from 'react';
import { PostDataFragment, useVoteMutation } from '../generated/graphql';

interface Props {
	post: PostDataFragment;
}

const Post: React.FC<Props> = ({ post }) => {
	const [{ fetching }, vote] = useVoteMutation();
	return (
		<Box shadow='md' borderWidth='1px' p={5} mb={5}>
			<Flex>
				<Flex
					alignItems='center'
					justifyContent='center'
					direction='column'
					mr={4}
				>
					<IconButton
						isLoading={fetching}
						variant='solid'
						variantColor={post.voteStatus == 1 ? 'green' : undefined}
						aria-label='Upvote'
						icon='chevron-up'
						mb={2}
						onClick={() => {
							if (post.voteStatus == 1) {
								return;
							}
							vote({
								postId: post.id,
								value: 1,
							});
						}}
					/>
					{post.points}
					<IconButton
						isLoading={fetching}
						variant='solid'
						variantColor={post.voteStatus == -1 ? 'red' : undefined}
						aria-label='Downvote'
						icon='chevron-down'
						mt={2}
						onClick={() => {
							if (post.voteStatus == -1) {
								return;
							}
							vote({
								postId: post.id,
								value: -1,
							});
						}}
					/>
				</Flex>
				<Box>
					<Heading fontSize='xl'>{post.title}</Heading>
					posted by {post.creator.username}
					<Text mt={4}>{post.textPreview}</Text>
				</Box>
			</Flex>
		</Box>
	);
};
export default Post;
