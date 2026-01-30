import { createContext, useContext, useState } from 'react'

type FavoriteContextType = {
  favorites: string[]
  toggleFavorite: (id: string) => void
}

const FavoriteContext = createContext<FavoriteContextType | null>(null)
export function FavouriteProvider({ children }: { children: React.ReactNode }) {

  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export const useFavorites = () => {
  const ctx = useContext(FavoriteContext)
  if (!ctx) throw new Error('useFavorites must be used inside provider')
  return ctx
}
