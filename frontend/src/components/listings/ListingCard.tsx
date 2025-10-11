import type { ListingViewModel } from '@/types/listing'

type Props = {
  listing: ListingViewModel
}

export const ListingCard = ({ listing }: Props) => {
  return (
    <article className="listing-card">
      <div className="listing-card__body">
        <h2>{listing.title}</h2>
        <p>{listing.description}</p>
      </div>
      <footer className="listing-card__footer">
        <span className="listing-card__price">{listing.priceLabel}</span>
      </footer>
    </article>
  )
}
