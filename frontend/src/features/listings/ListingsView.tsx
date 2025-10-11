import { ListingCard } from '@/components/listings/ListingCard'
import { useListings } from '@/hooks/useListings'

export const ListingsView = () => {
  const { data: listings, isLoading, error } = useListings()

  if (isLoading) {
    return <p className="status-message">Loading listings…</p>
  }

  if (error) {
    return <p className="status-message status-message--error">Failed to load listings.</p>
  }

  if (!listings?.length) {
    return <p className="status-message">No listings yet. Be the first to add one!</p>
  }

  return (
    <section className="listings-grid">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </section>
  )
}
