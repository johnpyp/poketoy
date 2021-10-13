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
  useToast,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";

import { PageWrapper } from "../components/PageWrapper";
import { MeDocument, useLoginMutation } from "../generated/graphql";

type LoginFormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const [loginMutation, { loading, error }] = useLoginMutation();
  const onSubmit = handleSubmit(async (values) => {
    const res = await loginMutation({
      variables: { input: { email: values.email, password: values.password } },
      refetchQueries: [MeDocument],
    });

    if (res.data?.login) {
      toast({
        title: "Logged in",
        description: `Welcome back, ${res.data.login.username ?? ""}`,
      });
    }
    console.log(values);
  });
  return (
    <PageWrapper>
      <Box width="sm">
        <Box>
          <Heading size="md">Login</Heading>
        </Box>
        <Box pt="4">
          <form onSubmit={onSubmit}>
            <VStack spacing="4">
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
