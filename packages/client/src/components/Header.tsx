import { Box, Button, Heading, HStack, Link, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import { useLogout } from "../hooks/useLogout";
import { useUser } from "../hooks/useUser";

export const Header: React.FC = () => {
  const { user } = useUser();
  const { logout, loading } = useLogout();
  return (
    <HStack p="4" bg="blue.600" minH="16">
      <Box>
        <Heading size="md" color="white">
          <Link as={RouterLink} to="/">
            PokeToy
          </Link>
        </Heading>
      </Box>
      <Spacer></Spacer>

      {user ? (
        <HStack>
          <Link as={RouterLink} to="/account" color="gray.100" _hover={{ color: "gray.400" }}>
            {user.username}
          </Link>
          <Button onClick={() => logout()} size="sm" isLoading={loading}>
            Logout
          </Button>
        </HStack>
      ) : (
        <HStack spacing="4">
          <Link as={RouterLink} to="/login" color="gray.100" _hover={{ color: "gray.400" }}>
            Login
          </Link>
          <Link as={RouterLink} to="/register" color="gray.100" _hover={{ color: "gray.400" }}>
            Register
          </Link>
        </HStack>
      )}
    </HStack>
  );
};
