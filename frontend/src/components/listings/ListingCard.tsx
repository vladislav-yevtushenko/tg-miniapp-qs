import { Avatar, Button, Card, Flex, Stack, Text } from "@chakra-ui/react";

import type { ListingViewModel } from "@/types/listing";

type Props = {
  listing: ListingViewModel;
  onViewDetails: (listing: ListingViewModel) => void;
};

export const ListingCard = ({ listing, onViewDetails }: Props) => {
  // Get the first photo - prefer thumbnail for performance
  const firstPhoto = listing.photos[0];
  const photoSrc = firstPhoto?.thumbnailData
    ? `data:image/jpeg;base64,${firstPhoto.thumbnailData}`
    : firstPhoto?.photoUrl || listing.photoUrl;

  return (
    <Card.Root variant="outline" shadow="sm">
      <Card.Body gap="3">
        <Flex align="center" gap={3}>
          <Avatar.Root size="lg" shape="rounded">
            {photoSrc && (
              <Avatar.Image
                src={photoSrc}
                alt={`${listing.title} photo`}
              />
            )}
            <Avatar.Fallback name={listing.title} />
          </Avatar.Root>
          <Stack gap={1}>
            <Card.Title>{listing.title}</Card.Title>
            <Card.Description color="fg.muted">
              {listing.description}
            </Card.Description>
          </Stack>
        </Flex>
      </Card.Body>
      <Card.Footer justifyContent="space-between" alignItems="center">
        <Text fontWeight="medium">{listing.priceLabel}</Text>
        <Button size="sm" variant="outline" colorPalette="primary" onClick={() => onViewDetails(listing)}>
          View
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};
