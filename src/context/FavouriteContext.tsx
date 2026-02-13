import { createContext, useContext, useState, useEffect } from 'react'

type FavouriteItem = {
  id: number
  title: string
  image: string
  rating: number
}

type FavouriteContextType = {
  favourites: FavouriteItem[]
  toggleFavourite: (item: FavouriteItem) => void
  isFavourite: (id: number) => boolean
}

export const FavouriteContext = createContext<FavouriteContextType | null>(null)

export function FavouriteProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('favourites')
    if (stored) setFavourites(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  const toggleFavourite = (item: FavouriteItem) => {
    setFavourites(prev =>
      prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    )  
  }

  const isFavourite = (id: number) =>
    favourites.some(f => f.id === id)

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouriteContext.Provider>
  )
}

export function useFavourite() {
  const context = useContext(FavouriteContext)
  if (!context) throw new Error('useFavourite must be used inside FavouriteProvider')
  return context
}
