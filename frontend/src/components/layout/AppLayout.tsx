import type { PropsWithChildren } from "react";
import { Children } from "react";

import {
  Avatar,
  Box,
  Container,
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaHome, FaPlus } from "react-icons/fa";
import { useTelegramContext } from "providers/telegramContext";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { user } = useTelegramContext();
  const cards = Children.toArray(children);

  return (
    <Flex direction="column" minHeight="100vh" bg="gray.50">
      <Box as="main" flex="1" overflowY="auto" py={6}>
        <Container maxW="container.md">
          {cards.length > 0 ? (
            <Stack gap={4}>{cards}</Stack>
          ) : (
            <Box
              borderWidth="1px"
              borderStyle="dashed"
              borderColor="gray.200"
              borderRadius="lg"
              py={12}
              textAlign="center"
              bg="white"
            >
              <Text fontSize="md" color="gray.500">
                No items yet—start by adding your first listing.
              </Text>
            </Box>
          )}
        </Container>
      </Box>

      <Box as="footer" bg="white" borderTopWidth="1px" px={4} py={3}>
        <Container maxW="container.md">
          <Flex align="center" gap={4}>
            <Flex flex="1" justify="flex-start">
              <IconButton aria-label="Home" variant="ghost" colorScheme="gray">
                <FaHome />
              </IconButton>
            </Flex>
            <Flex flex="1" justify="center">
              <IconButton
                aria-label="Add item"
                colorScheme="teal"
                rounded="full"
                size="lg"
                shadow="md"
              >
                <FaPlus />
              </IconButton>
            </Flex>
            <Flex flex="1" justify="flex-end">
              {user && (
                <Avatar.Root size="md">
                  <Avatar.Fallback name={user.first_name} />
                  {user.photo_url && (
                    <Avatar.Image
                      src={user.photo_url}
                      alt={`${user.first_name}'s profile picture`}
                    />
                  )}
                </Avatar.Root>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
};
