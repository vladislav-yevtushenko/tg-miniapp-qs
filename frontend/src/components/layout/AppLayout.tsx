import type { PropsWithChildren } from "react";
import { Children } from "react";

import {
  Avatar,
  Box,
  Card,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaHome, FaPlus, FaUser } from "react-icons/fa";
import { useTelegramContext } from "providers/telegramContext";
import { env } from "config/env";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { user } = useTelegramContext();
  const cards = Children.toArray(children);

  return (
    <Flex direction="column" minHeight="100vh" bg="gray.50">
      <Box as="header" bg="white" borderBottomWidth="1px" px={4} py={5}>
        <Container maxW="container.md">
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Heading size="md">{env.appName}</Heading>
              <Text fontSize="sm" color="gray.500">
                Find and sell items with your classmates
              </Text>
            </Box>
            {user && (
              <HStack gap={3}>
                <Avatar.Root size="md">
                  <Avatar.Fallback name={user.first_name} />
                  {user.photo_url && (
                    <Avatar.Image
                      src={user.photo_url}
                      alt={`${user.first_name}'s profile picture`}
                    />
                  )}
                </Avatar.Root>
                <Box textAlign="right">
                  <Text fontWeight="medium">{user.first_name}</Text>
                  {user.username && (
                    <Text fontSize="xs" color="gray.500">
                      @{user.username}
                    </Text>
                  )}
                </Box>
              </HStack>
            )}
          </Flex>
        </Container>
      </Box>

      <Container as="main" maxW="container.md" flex="1" py={6}>
        <Stack gap={4}>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <Card.Root
                key={index}
                variant="outline"
                bg="white"
                borderColor="gray.100"
                shadow="sm"
              >
                <Card.Body>{card}</Card.Body>
              </Card.Root>
            ))
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
        </Stack>
      </Container>

      <Box as="footer" bg="white" borderTopWidth="1px" px={4} py={3}>
        <Container maxW="container.md">
          <Flex align="center" justify="space-around">
            <IconButton aria-label="Home" variant="ghost" colorScheme="gray">
              <FaHome />
            </IconButton>
            <IconButton
              aria-label="Add item"
              colorScheme="teal"
              rounded="full"
              size="lg"
              shadow="md"
            >
              <FaPlus />
            </IconButton>
            <IconButton aria-label="Profile" variant="ghost" colorScheme="gray">
              <FaUser />
            </IconButton>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
};
