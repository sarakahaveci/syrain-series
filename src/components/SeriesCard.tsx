import { motion } from 'framer-motion'
import FavoriteButton from './FavouriteButton'
import { Link } from 'react-router-dom'

type SeriesCardProps = {
  id: string
  title: string
  image: string
  rating: number
}

export default function SeriesCard({
  id,
  title,
  image,
  rating
}: SeriesCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }}>
      <Link to={`/series/${id}`} className="relative group">
        <div className="rounded-2xl overflow-hidden bg-white shadow-md">
          <div className="relative">
            <img
              src={image}
              alt={title}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <FavoriteButton id={id} />
          </div>

          <div className="p-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-indigo-600">⭐ {rating}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
