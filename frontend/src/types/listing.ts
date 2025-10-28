export type UserPublic = {
  id: number
  telegram_id: number
  username: string | null
  first_name: string
  last_name: string | null
  photo_url: string | null
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
  photos: string[]
  photoUrl: string | null
  seller: UserPublic
}

export type ListingViewModel = Listing & {
  priceLabel: string
}
