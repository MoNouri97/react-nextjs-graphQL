import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { FormField } from '../components/FormField';
import Wrapper from '../components/Wrapper';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ username: '', password: '' }}
				onSubmit={values => {
					console.log(values);
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
