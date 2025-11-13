import { Stack, Text, Flex } from "@chakra-ui/react";
import { ListingCard } from "components/listings/ListingCard";
import { ListingDetail } from "components/listings/ListingDetail";
import { useListings } from "hooks/useListings";

import { useEffect, useState } from "react";
import type { ListingViewModel } from "@/types/listing";

type Props = {
  searchQuery: string;
};

export const ListingsView = ({ searchQuery }: Props) => {
  const { data: listings, isLoading, error } = useListings(searchQuery);
  const [selectedListing, setSelectedListing] =
    useState<ListingViewModel | null>(null);

  useEffect(() => {
    console.log("Listings data:", listings);
  }, [listings]);

  if (isLoading) {
    return <p className="status-message">Loading listings…</p>;
  }

  if (error) {
    return (
      <p className="status-message status-message--error">
        Failed to load listings.
      </p>
    );
  }

  return (
    <>
      {searchQuery && listings && (
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Text fontSize="sm" color="fg.muted">
            Search results for: <strong>{searchQuery}</strong>
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {listings.length} {listings.length === 1 ? "result" : "results"}
          </Text>
        </Flex>
      )}

      {listings && listings.length === 0 && searchQuery ? (
        <Text textAlign="center" py={8} color="fg.muted">
          No listings found matching "{searchQuery}"
        </Text>
      ) : (
        <Stack as="section" gap={4}>
          {listings?.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onViewDetails={setSelectedListing}
            />
          ))}
        </Stack>
      )}

      <ListingDetail
        listing={selectedListing}
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </>
  );
};
