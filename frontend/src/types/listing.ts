export type Listing = {
  id: number
  title: string
  description: string
  priceMinorUnits: number
  currency: string
  sellerId: number
  createdAt: string
}

export type ListingViewModel = Listing & {
  priceLabel: string
}
