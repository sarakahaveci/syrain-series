import SeriesCard from '../components/SeriesCard'
import { useFavourite } from '../context/FavouriteContext'

export default function Favourite() {
  const { favourites } = useFavourite()

  if (favourites.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-20">
        <h2 className="text-2xl font-bold">No favourites yet 💔</h2>
        <p className="mt-2">Start adding some series!</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">⭐ Your Favourite Series</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map(series => (
          <SeriesCard
            key={series.id}
            id={series.id}
            title={series.title}
            image={series.image}
            rating={series.rating}
          />
        ))}
      </div>
    </div>
  )
}
