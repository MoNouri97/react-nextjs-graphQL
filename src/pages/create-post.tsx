import { Box, Flex, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FormField } from '../components/FormField';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

interface createPostProps {}

const createPost: React.FC<createPostProps> = ({}) => {
	useIsAuth();
	const router = useRouter();
	const [, createPost] = useCreatePostMutation();

	return (
		<Layout variant='small'>
			<Formik
				initialValues={{ title: '', text: '' }}
				onSubmit={async values => {
					const { error } = await createPost({ input: values });
					if (!error) router.push('/');
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<FormField name='title' label='Title' placeholder='Post title' />
						<Box mt={8}>
							<FormField
								textarea
								name='text'
								label='Body'
								placeholder='post body ...'
							/>
						</Box>
						<Flex mt={4}>
							<Button
								type='submit'
								isLoading={isSubmitting}
								variantColor='teal'
							>
								Create Post
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};
export default withUrqlClient(createUrqlClient)(createPost);
