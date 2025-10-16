import {
  Avatar,
  Badge,
  Box,
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import type { ListingViewModel } from "@/types/listing";

interface ListingDetailProps {
  listing: ListingViewModel | null;
  open: boolean;
  onClose: () => void;
}

export const ListingDetail = ({ listing, open, onClose }: ListingDetailProps) => {
  if (!listing) return null;

  // Mock seller data - in real app, this would come from API
  const seller = {
    name: "John Doe",
    username: "johndoe",
    photoUrl: null,
    phone: "+1 234 567 8900",
    email: "john@example.com",
  };

  return (
    <DrawerRoot open={open} onOpenChange={(e) => !e.open && onClose()} placement="end" size="md">
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <DrawerCloseTrigger />
          <DrawerHeader>
            <Heading size="lg">{listing.title}</Heading>
          </DrawerHeader>
          
          <DrawerBody>
            <Stack gap={6}>
              {/* Main Image */}
              {listing.photoUrl && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={listing.photoUrl}
                    alt={listing.title}
                    width="100%"
                    height="300px"
                    objectFit="cover"
                  />
                </Box>
              )}

              {/* Price */}
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                  {listing.priceLabel}
                </Text>
              </Box>

              {/* Description */}
              <Box>
                <Heading size="md" mb={2}>Description</Heading>
                <Text color="gray.700" lineHeight="1.7">
                  {listing.description}
                </Text>
              </Box>

              {/* Seller Information */}
              <Box>
                <Heading size="md" mb={3}>Seller Information</Heading>
                <Stack gap={3}>
                  <Flex align="center" gap={3}>
                    <Avatar.Root size="lg">
                      <Avatar.Fallback name={seller.name} />
                      {seller.photoUrl && (
                        <Avatar.Image src={seller.photoUrl} alt={seller.name} />
                      )}
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">{seller.name}</Text>
                      {seller.username && (
                        <Text color="gray.600">@{seller.username}</Text>
                      )}
                    </Box>
                  </Flex>

                  <Stack gap={2} mt={2}>
                    <Flex align="center" gap={2} color="gray.700">
                      <FaPhone />
                      <Text>{seller.phone}</Text>
                    </Flex>
                    <Flex align="center" gap={2} color="gray.700">
                      <FaEnvelope />
                      <Text>{seller.email}</Text>
                    </Flex>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Stack width="100%" gap={2}>
              <Button colorScheme="teal" size="lg" width="100%">
                Contact Seller
              </Button>
              <Button variant="outline" size="lg" width="100%" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
};
