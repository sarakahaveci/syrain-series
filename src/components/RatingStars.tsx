type Props = {
  rating: number
}

export default function RatingStars({ rating }: Props) {
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {rating >= i + 1 ? '★' : '☆'}
        </span>
      ))}
      <span className="text-sm text-gray-400 ml-2">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}
