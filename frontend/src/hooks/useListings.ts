import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/services/apiClient";
import type { Listing, ListingViewModel } from "@/types/listing";

type ListingApiResponse = {
  id: number;
  title: string;
  description: string;
  price_minor_units: number;
  currency: string;
  seller_id: number;
  created_at: string;
};

const transformListing = (listing: ListingApiResponse): Listing => ({
  id: listing.id,
  title: listing.title,
  description: listing.description,
  priceMinorUnits: listing.price_minor_units,
  currency: listing.currency,
  sellerId: listing.seller_id,
  createdAt: listing.created_at,
});

const formatPrice = (listing: Listing): ListingViewModel => ({
  ...listing,
  priceLabel: `${(listing.priceMinorUnits / 100).toFixed(2)} ${listing.currency}`,
});

export const useListings = () => {
  return useQuery<ListingViewModel[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data } = await apiClient.get<ListingApiResponse[]>("/listings");
      console.log("Fetched listings:", data);
      return data.map((listing) => formatPrice(transformListing(listing)));
    },
    placeholderData: [] satisfies ListingViewModel[],
  });
};
