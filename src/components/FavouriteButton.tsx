import { motion } from 'framer-motion'
import { useFavorites } from '../context/FavouriteContext'

export default function FavoriteButton({ id }: { id: string }) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFav = favorites.includes(id)

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      onClick={(e) => {
        e.preventDefault()
        toggleFavorite(id)
      }}
      className={`absolute top-3 right-3 text-2xl ${
        isFav ? 'text-red-500' : 'text-white'
      }`}
    >
      {isFav ? '❤️' : '🤍'}
    </motion.button>
  )
}
