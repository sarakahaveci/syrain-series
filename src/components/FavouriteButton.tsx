import { createContext, useContext, useState, ReactNode } from 'react'

export type FavouriteContextType = {
  favorites: string[]          // add this
  toggleFavorite: (id: string) => void  // add this
}

const FavouriteContext = createContext<FavouriteContextType | undefined>(undefined)

export const FavouriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <FavouriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavouriteContext.Provider>
  )
}

export const useFavourite = () => {
  const context = useContext(FavouriteContext)
  if (!context) throw new Error('useFavourite must be used within FavouriteProvider')
  return context
}
