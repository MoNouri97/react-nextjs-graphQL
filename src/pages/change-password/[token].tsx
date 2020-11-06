import { Alert, AlertIcon, Box, Button, Flex, Link } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FormField } from '../../components/FormField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';

const ChangePassword: React.FC<{}> = () => {
	const router = useRouter();
	const token = router.query.token as string;
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState('');

	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ password: '' }}
				onSubmit={async (values, { setErrors }) => {
					const response = await changePassword({
						token: token,
						password: values.password,
					});
					if (response.data?.changePassword.user) {
						router.push('/');
						return;
					}
					if (response.data?.changePassword.errors) {
						const errors = toErrorMap(response.data.changePassword.errors);
						if ('token' in errors) {
							setTokenError(errors.token);
						}
						setErrors(errors);
						return;
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<FormField
							name='password'
							label='New Password'
							placeholder='shhhhh'
							type='password'
						/>

						<Button
							type='submit'
							isLoading={isSubmitting}
							variantColor='teal'
							mt={4}
						>
							Change Password
						</Button>
						{tokenError ? (
							<Box mt={4}>
								<Alert status='error'>
									<AlertIcon />
									{tokenError}
									<Link ml={4}>
										<NextLink href='/forgot-password'>
											click to get a new one
										</NextLink>
									</Link>
								</Alert>
							</Box>
						) : null}
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
