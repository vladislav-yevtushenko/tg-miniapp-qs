import { Stack } from "@chakra-ui/react";
import { ListingCard } from "components/listings/ListingCard";
import { ListingDetail } from "components/listings/ListingDetail";
import { useListings } from "hooks/useListings";

import { useEffect, useState } from "react";
import type { ListingViewModel } from "@/types/listing";

export const ListingsView = () => {
  const { data: listings, isLoading, error } = useListings();
  const [selectedListing, setSelectedListing] = useState<ListingViewModel | null>(null);

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

  if (!listings?.length) {
    return (
      <p className="status-message">
        No listings yet. Be the first to add one!
      </p>
    );
  }

  return (
    <>
      <Stack as="section" gap={4}>
        {listings.map((listing) => (
          <ListingCard 
            key={listing.id} 
            listing={listing} 
            onViewDetails={setSelectedListing}
          />
        ))}
      </Stack>
      
      <ListingDetail 
        listing={selectedListing} 
        open={!!selectedListing} 
        onClose={() => setSelectedListing(null)} 
      />
    </>
  );
};
