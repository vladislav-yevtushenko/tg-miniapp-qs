import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "services/apiClient";
import type { PhotoUploadResponse } from "@/types/listing";

export const useUploadPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      photos,
    }: {
      listingId: number;
      photos: File[];
    }): Promise<PhotoUploadResponse[]> => {
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const response = await apiClient.post<PhotoUploadResponse[]>(
        `/listings/${listingId}/photos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
