type RatingProps = {
  value: number
}

export default function Rating({ value }: RatingProps) {
  return <span>⭐ {value}</span>
}
