import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { useRouter } from 'next/router';
import { FormField } from '../components/FormField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
	const router = useRouter();
	const [, register] = useRegisterMutation();

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register(values);

					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
						return;
					}

					if (response.data?.register.user) {
						router.push('/');
					}
				}}
			>
				{({ values, handleChange, isSubmitting }) => (
					<Form>
						<FormField
							name='username'
							label='Username'
							placeholder='username'
						/>
						<Box mt={8}>
							<FormField
								name='password'
								label='Password'
								placeholder='password'
								type='password'
							/>
						</Box>
						<Button
							type='submit'
							isLoading={isSubmitting}
							variantColor='teal'
							mt={4}
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};
export default Register;
