import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label: string;
	textarea?: boolean;
};

export const FormField: React.FC<Props> = ({
	size: _,
	textarea = false,
	label,
	...props
}) => {
	const [field, { error }] = useField(props);

	const InputOrTextArea = textarea ? Textarea : Input;

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputOrTextArea {...field} {...props} id={field.name} />
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
