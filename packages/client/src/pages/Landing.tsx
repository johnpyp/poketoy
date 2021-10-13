import { Box, HStack, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import { PageWrapper } from "../components/PageWrapper";
import { useUserListQuery } from "../generated/graphql";

export const Landing: React.FC = () => {
  const { data: users } = useUserListQuery();
  return (
    <PageWrapper>
      <SimpleGrid columns={2} spacing={4}>
        {users &&
          (users.users.length > 1 ? (
            users.users.map((user) => (
              <Box borderWidth="1px" borderRadius="lg" p="6" key={user.id}>
                <HStack>
                  <Text fontWeight="semibold">User ID</Text>
                  <Spacer />
                  <Text>{user.id}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Email</Text>
                  <Spacer />
                  <Text>{user.email}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Username</Text>
                  <Spacer />
                  <Text>{user.username}</Text>
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No users</Text>
          ))}
      </SimpleGrid>
    </PageWrapper>
  );
};
