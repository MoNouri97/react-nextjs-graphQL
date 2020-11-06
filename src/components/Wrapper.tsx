import { Box } from '@chakra-ui/core';
import React from 'react';

export type WrapperVariant = 'regular' | 'small';
interface WrapperProps {
	variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
	return (
		<Box
			w='100%'
			maxW={variant == 'regular' ? '800px' : '400px'}
			mx='auto'
			mt={8}
		>
			{children}
		</Box>
	);
};
export default Wrapper;
