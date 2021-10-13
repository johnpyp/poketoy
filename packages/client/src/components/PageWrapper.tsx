import { Flex } from "@chakra-ui/react";
import React from "react";

export interface PageWrapperProps {
  variant?: "sm";
}
export const PageWrapper: React.FC<PageWrapperProps> = ({ children, variant }) => {
  return (
    <Flex justify="center" py="8" w={variant === "sm" ? "sm" : "full"}>
      {children}
    </Flex>
  );
};
