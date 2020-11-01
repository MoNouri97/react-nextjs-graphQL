import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string;
};

export const FormField: React.FC<Props> = ({ label, size: _, ...props }) => {
	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Input {...field} {...props} id={field.name} />
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
