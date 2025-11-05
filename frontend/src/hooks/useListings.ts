import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/services/apiClient";
import type { Listing, ListingViewModel, PhotoResponse, UserPublic } from "@/types/listing";

type PhotoApiResponse = {
  id: number;
  photo_url: string;
  display_order: number;
  thumbnail_data: string | null;
  file_size_bytes: number | null;
  original_filename: string | null;
  created_at: string;
};

type ListingApiResponse = {
  id: number;
  title: string;
  description: string;
  price_minor_units: number;
  currency: string;
  seller_id: number;
  created_at: string;
  updated_at: string;
  photos: PhotoApiResponse[];
  seller: UserPublic;
};

const transformPhoto = (photo: PhotoApiResponse): PhotoResponse => ({
  id: photo.id,
  photoUrl: photo.photo_url,
  displayOrder: photo.display_order,
  thumbnailData: photo.thumbnail_data,
  fileSizeBytes: photo.file_size_bytes,
  originalFilename: photo.original_filename,
  createdAt: photo.created_at,
});

const transformListing = (listing: ListingApiResponse): Listing => ({
  id: listing.id,
  title: listing.title,
  description: listing.description,
  priceMinorUnits: listing.price_minor_units,
  currency: listing.currency,
  sellerId: listing.seller_id,
  createdAt: listing.created_at,
  updatedAt: listing.updated_at,
  photos: listing.photos.map(transformPhoto),
  photoUrl: listing.photos[0]?.photo_url ?? null,
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
