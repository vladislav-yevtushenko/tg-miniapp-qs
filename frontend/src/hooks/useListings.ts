import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/services/apiClient";
import type { Listing, ListingViewModel, UserPublic } from "@/types/listing";

type ListingApiResponse = {
  id: number;
  title: string;
  description: string;
  price_minor_units: number;
  currency: string;
  seller_id: number;
  created_at: string;
  updated_at: string;
  photos: string[];
  seller: UserPublic;
};

const transformListing = (listing: ListingApiResponse): Listing => ({
  id: listing.id,
  title: listing.title,
  description: listing.description,
  priceMinorUnits: listing.price_minor_units,
  currency: listing.currency,
  sellerId: listing.seller_id,
  createdAt: listing.created_at,
  updatedAt: listing.updated_at,
  photos: listing.photos,
  photoUrl: listing.photos[0],
  seller: listing.seller,
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
