import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

import { useDeleteMeMutation } from "../generated/graphql";
import { client } from "../graphql/client";

interface DeleteMeValues {
  currentPassword: string;
}
export const DeleteMeForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<DeleteMeValues>();
  const [deleteMeMutation, { loading, error }] = useDeleteMeMutation();

  const onSubmit = handleSubmit(async (values) => {
    await deleteMeMutation({
      variables: {
        input: {
          currentPassword: values.currentPassword,
        },
      },
    });

    await client.resetStore();
  });
  return (
    <form onSubmit={onSubmit}>
      <VStack spacing="4">
        <FormControl isInvalid={!!errors.currentPassword} isRequired>
          <FormLabel htmlFor="currentPassword" fontWeight="semibold" required>
            Verify Current Password
          </FormLabel>
          <Input
            type="password"
            id="currentPassword"
            placeholder="Current Password"
            {...register("currentPassword", {
              required: "Required",
              minLength: { value: 4, message: "Minimum 4 characters" },
            })}
          ></Input>

          <FormErrorMessage>
            {errors.currentPassword && errors.currentPassword.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          width="full"
          mt={4}
          colorScheme="red"
          isLoading={isSubmitting || loading}
          type="submit"
        >
          Delete Account
        </Button>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </VStack>
    </form>
  );
};
