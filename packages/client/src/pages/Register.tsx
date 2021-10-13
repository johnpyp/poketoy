import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

import { PageWrapper } from "../components/PageWrapper";
import { useRegisterMutation } from "../generated/graphql";

type LoginFormValues = {
  username: string;
  email: string;
  password: string;
};

export const Register: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const toast = useToast();
  const [registerMutation, { loading, error }] = useRegisterMutation();
  const onSubmit = handleSubmit(async (values) => {
    const res = await registerMutation({
      variables: {
        input: { email: values.email, username: values.username, password: values.password },
      },
    });
    if (!res.errors) {
      toast({
        title: "Account created",
        description: `Registration complete, welcome, ${res.data?.register.username ?? ""}`,
      });
    }
    console.log(values);
  });
  return (
    <PageWrapper>
      <Box width="sm">
        <Box>
          <Heading size="md">Register</Heading>
        </Box>
        <Box pt="4">
          <form onSubmit={onSubmit}>
            <VStack spacing="4">
              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel htmlFor="username" fontWeight="bold">
                  Username
                </FormLabel>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 4, message: "Minimum 4 characters" },
                  })}
                ></Input>

                <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel htmlFor="email" fontWeight="bold">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    minLength: { value: 4, message: "Minimum 4 characters" },
                  })}
                ></Input>

                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel htmlFor="password" fontWeight="bold" required>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password", {
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
                Submit
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
      </Box>
    </PageWrapper>
  );
};
