import {
  Avatar,
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
import type { ListingViewModel } from "@/types/listing";

interface ListingDetailProps {
  listing: ListingViewModel | null;
  open: boolean;
  onClose: () => void;
}

export const ListingDetail = ({ listing, open, onClose }: ListingDetailProps) => {
  if (!listing) return null;

  // Get seller info from listing
  const seller = listing.seller;
  const sellerName = [seller.first_name, seller.last_name]
    .filter(Boolean)
    .join(" ");
  const telegramLink = seller.username
    ? `https://t.me/${seller.username}`
    : `tg://user?id=${seller.telegram_id}`;

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
              {/* Main Image - Use full resolution photoUrl, not thumbnail */}
              {(listing.photos[0]?.photoUrl || listing.photoUrl) && (
                <Box borderRadius="md" overflow="hidden">
                  <Image
                    src={listing.photos[0]?.photoUrl || listing.photoUrl}
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
                      <Avatar.Fallback>{sellerName}</Avatar.Fallback>
                      {seller.photo_url && (
                        <Avatar.Image src={seller.photo_url} alt={sellerName} />
                      )}
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">{sellerName}</Text>
                      {seller.username && (
                        <Text color="gray.600">@{seller.username}</Text>
                      )}
                    </Box>
                  </Flex>
                </Stack>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Stack width="100%" gap={2}>
              <Button
                as="a"
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="teal"
                size="lg"
                width="100%"
              >
                Contact via Telegram
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
