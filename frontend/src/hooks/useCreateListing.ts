import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/services/apiClient";

type CreateListingData = {
  title: string;
  description: string;
  price_minor_units: number;
  currency: string;
  category?: string | null;
  condition?: string | null;
};

type ListingResponse = {
  id: number;
  title: string;
  description: string;
  price_minor_units: number;
  currency: string;
  seller_id: number;
  created_at: string;
  updated_at: string;
  photos: string[];
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateListingData): Promise<ListingResponse> => {
      const response = await apiClient.post<ListingResponse>("/listings", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate listings query to refetch
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
