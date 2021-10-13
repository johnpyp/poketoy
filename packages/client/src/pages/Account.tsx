import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

import { DeleteMeForm } from "../components/DeleteMeForm";
import { PageWrapper } from "../components/PageWrapper";
import { useUpdateMeMutation } from "../generated/graphql";
import { useUser } from "../hooks/useUser";

type UpdateMeValues = {
  currentPassword: string;
  username?: string;
  email?: string;
  password?: string;
};

export const Account: React.FC = () => {
  const { user } = useUser();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdateMeValues>();

  const [updateMeMutation, { loading, error }] = useUpdateMeMutation();
  const onSubmit = handleSubmit(async (values) => {
    await updateMeMutation({
      variables: {
        input: {
          currentPassword: values.currentPassword,
          username: values.username ?? null,
          email: values.email ?? null,
          newPassword: values.password ?? null,
        },
      },
    });
    console.log(values);
  });
  return (
    <PageWrapper>
      <VStack align="left" width="md">
        <Heading size="lg" fontWeight="semibold">
          Account Info
        </Heading>
        {user && (
          <Flex pt="2" direction="column" align="left">
            <Text>Email: {user.email}</Text>
            <Text>Username: {user.username}</Text>
          </Flex>
        )}
        <Divider my="8"></Divider>
        <Heading size="lg" fontWeight="semibold">
          Update Account
        </Heading>
        <Box pt="4">
          <form onSubmit={onSubmit}>
            <VStack spacing="4">
              <FormControl isInvalid={!!errors.username}>
                <FormLabel htmlFor="username" fontWeight="semibold">
                  Username
                </FormLabel>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register("username", {
                    minLength: { value: 4, message: "Minimum 4 characters" },
                  })}
                ></Input>

                <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" fontWeight="semibold">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email", {
                    minLength: { value: 4, message: "Minimum 4 characters" },
                  })}
                ></Input>

                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password" fontWeight="semibold" required>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password", {
                    minLength: { value: 4, message: "Minimum 4 characters" },
                  })}
                ></Input>

                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>

              <Divider my="2"></Divider>
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

                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>

              <Button
                width="full"
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting || loading}
                type="submit"
              >
                Update Account
              </Button>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
            </VStack>
          </form>
        </Box>
        <Box>
          <Divider my="8"></Divider>
          <Heading size="lg" fontWeight="semibold">
            Delete Account
          </Heading>
          <Box mt="4">
            <DeleteMeForm></DeleteMeForm>
          </Box>
        </Box>
      </VStack>
    </PageWrapper>
  );
};
