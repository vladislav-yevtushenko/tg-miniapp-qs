import type { PropsWithChildren } from "react";
import { Children, useState } from "react";

import {
  Avatar,
  Box,
  Container,
  Flex,
  IconButton,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FaHome,
  FaPlus,
  FaSignInAlt,
  FaUser,
  FaEnvelope,
  FaShoppingCart,
  FaShoppingBag,
  FaSearch,
} from "react-icons/fa";
import { LuBell } from "react-icons/lu";
import { useTelegramContext } from "providers/telegramContext";
import { ProfileDrawer } from "components/profile/ProfileDrawer";
import { AddListingDrawer } from "components/listings/AddListingDrawer";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { user } = useTelegramContext();
  const cards = Children.toArray(children);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);

  return (
    <Flex direction="column" height="100vh" bg="gray.50">
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
          <Flex justifyContent="space-between" gap={4}>
            <IconButton aria-label="Home" variant="ghost" colorScheme="gray">
              <FaHome />
            </IconButton>
            <IconButton aria-label="Search" variant="ghost" colorScheme="gray">
              <FaSearch />
            </IconButton>
            <IconButton
              aria-label="Add item"
              colorScheme="teal"
              rounded="full"
              size="lg"
              shadow="md"
              onClick={() => setIsAddListingOpen(true)}
            >
              <FaPlus />
            </IconButton>
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              colorScheme="gray"
            >
              <LuBell />
            </IconButton>
            {user && (
              <MenuRoot>
                <MenuTrigger asChild>
                  <Box cursor="pointer">
                    <Avatar.Root size="md">
                      <Avatar.Fallback name={user.first_name} />
                      {user.photo_url && (
                        <Avatar.Image
                          src={user.photo_url}
                          alt={`${user.first_name}'s profile picture`}
                        />
                      )}
                    </Avatar.Root>
                  </Box>
                </MenuTrigger>
                <Portal>
                  <MenuPositioner>
                    <MenuContent>
                      <MenuItem value="signin">
                        <FaSignInAlt /> Sign In
                      </MenuItem>
                      <MenuItem
                        value="profile"
                        onClick={() => setIsProfileOpen(true)}
                      >
                        <FaUser /> Profile
                      </MenuItem>
                      <MenuItem value="messages">
                        <FaEnvelope /> Messages
                      </MenuItem>
                      <MenuItem value="order">
                        <FaShoppingCart /> Orders
                      </MenuItem>
                      <MenuItem value="purchases">
                        <FaShoppingBag /> Purchases
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </Portal>
              </MenuRoot>
            )}
          </Flex>
        </Container>
      </Box>

      <ProfileDrawer
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <AddListingDrawer
        open={isAddListingOpen}
        onClose={() => setIsAddListingOpen(false)}
      />
    </Flex>
  );
};
