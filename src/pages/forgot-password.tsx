import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { FormField } from '../components/FormField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const forgotPassword: React.FC = ({}) => {
	const [, forgotPassword] = useForgotPasswordMutation();
	const [complete, setComplete] = useState(false);

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values, {}) => {
					forgotPassword(values);
					setComplete(true);
				}}
			>
				{({ isSubmitting }) =>
					complete ? (
						<Box>an email is sent</Box>
					) : (
						<Form>
							<FormField name='email' label='Email' placeholder='Gon@Hxh.com' />

							<Button
								type='submit'
								isLoading={isSubmitting}
								variantColor='teal'
								mt={4}
							>
								Submit
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};
export default withUrqlClient(createUrqlClient)(forgotPassword);
