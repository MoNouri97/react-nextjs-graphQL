import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { useRouter } from 'next/router';
import { FormField } from '../components/FormField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Login: React.FC = () => {
	const router = useRouter();
	const [, login] = useLoginMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ usernameOrEmail: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login({ options: values });

					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
						return;
					}

					if (response.data?.login.user) {
						router.push('/');
					}
				}}
			>
				{({ values, handleChange, isSubmitting }) => (
					<Form>
						<FormField
							name='usernameOrEmail'
							label='Username Or Email'
							placeholder='Gon@Hxh.com'
						/>
						<Box mt={8}>
							<FormField
								name='password'
								label='Password'
								placeholder='shhhhh'
								type='password'
							/>
						</Box>
						<Button
							type='submit'
							isLoading={isSubmitting}
							variantColor='teal'
							mt={4}
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};
export default withUrqlClient(createUrqlClient)(Login);
