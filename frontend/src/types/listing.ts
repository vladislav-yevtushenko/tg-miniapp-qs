export type UserPublic = {
  id: number
  telegram_id: number
  username: string | null
  first_name: string
  last_name: string | null
  photo_url: string | null
}

export type PhotoResponse = {
  id: number
  photoUrl: string
  displayOrder: number
  thumbnailData: string | null  // Base64-encoded thumbnail
  fileSizeBytes: number | null
  originalFilename: string | null
  createdAt: string
}

export type PhotoUploadResponse = {
  url: string
  thumbnail: string | null  // Base64-encoded thumbnail
}

export type Listing = {
  id: number
  title: string
  description: string
  priceMinorUnits: number
  currency: string
  sellerId: number
  createdAt: string
  updatedAt: string
  photos: PhotoResponse[]
  photoUrl: string | null  // Deprecated: use photos[0]?.photoUrl instead
  seller: UserPublic
}

export type ListingViewModel = Listing & {
  priceLabel: string
}
