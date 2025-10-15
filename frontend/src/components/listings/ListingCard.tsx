import { Avatar, Button, Card, Flex, Stack, Text } from "@chakra-ui/react";

import type { ListingViewModel } from "@/types/listing";

type Props = {
  listing: ListingViewModel;
};

export const ListingCard = ({ listing }: Props) => {
  return (
    <Card.Root variant="outline" shadow="sm">
      <Card.Body gap="3">
        <Flex align="center" gap={3}>
          <Avatar.Root size="lg" shape="rounded">
            {listing.photoUrl && (
              <Avatar.Image
                src={listing.photoUrl}
                alt={`${listing.title} photo`}
              />
            )}
            <Avatar.Fallback name={listing.title} />
          </Avatar.Root>
          <Stack gap={1}>
            <Card.Title>{listing.title}</Card.Title>
            <Card.Description color="gray.600">
              {listing.description}
            </Card.Description>
          </Stack>
        </Flex>
      </Card.Body>
      <Card.Footer justifyContent="space-between" alignItems="center">
        <Text fontWeight="medium">{listing.priceLabel}</Text>
        <Button size="sm" variant="outline" colorScheme="teal">
          View
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};
