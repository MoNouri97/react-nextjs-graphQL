import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery();
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	let body = null;
	if (!fetching && !data?.me) {
		body = (
			<>
				<NextLink href='/login'>
					<Link mr={2}>Login</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link>Register</Link>
				</NextLink>
			</>
		);
	} else if (data?.me) {
		body = (
			<Flex>
				<Box>{data.me.username}</Box>
				<Button
					onClick={() => {
						logout();
					}}
					isLoading={logoutFetching}
					mx={3}
					variant='link'
				>
					Logout
				</Button>
			</Flex>
		);
	}

	return (
		<Flex bg='crimson' w='100%' p={4} color='white'>
			<Box ml='auto'>{body}</Box>
		</Flex>
	);
};
export default withUrqlClient(createUrqlClient)(Navbar);
