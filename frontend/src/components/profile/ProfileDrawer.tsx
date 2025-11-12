import {
  Avatar,
  Badge,
  Box,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useTelegramContext } from "providers/telegramContext";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps) => {
  const { user } = useTelegramContext();

  return (
    <DrawerRoot open={open} onOpenChange={(e) => !e.open && onClose()} placement="end">
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <DrawerCloseTrigger />
          <DrawerHeader>Profile</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" align="center" gap={4} py={4}>
              {user && (
                <>
                  <Avatar.Root size="2xl">
                    <Avatar.Fallback name={user.first_name} />
                    {user.photo_url && (
                      <Avatar.Image
                        src={user.photo_url}
                        alt={`${user.first_name}'s profile picture`}
                      />
                    )}
                  </Avatar.Root>
                  <Text fontSize="2xl" fontWeight="bold">
                    {user.first_name} {user.last_name || ""}
                  </Text>
                  {user.username && (
                    <Text fontSize="md" color="fg.muted">
                      @{user.username}
                    </Text>
                  )}
                </>
              )}
              
              <Box mt={4}>
                <Badge colorPalette={user ? "green" : "red"} size="lg">
                  {user ? "Authorized" : "Not Authorized"}
                </Badge>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
};
