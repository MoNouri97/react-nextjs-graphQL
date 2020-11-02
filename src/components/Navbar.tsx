import { Box, Button, Flex, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';
import { useMeQuery } from '../generated/graphql';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery();
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
				<Button mx={3} variant='link'>
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
export default Navbar;
