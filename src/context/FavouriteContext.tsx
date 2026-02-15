import { createContext, useContext, useEffect, useState } from "react"

export type FavouriteItem = {
  id: number
  title: string
  image: string
  rating: number
}

export type FavouriteContextType = {
  favourites: FavouriteItem[]
  toggleFavourite: (item: FavouriteItem) => void
  isFavourite: (id: number) => boolean
}

const FavouriteContext = createContext<FavouriteContextType | undefined>(undefined)

export function FavouriteProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteItem[]>(() => {
    const stored = localStorage.getItem("favourites")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites))
  }, [favourites])

  function toggleFavourite(item: FavouriteItem) {
    setFavourites(prev => {
      const exists = prev.some(f => f.id === item.id)
      if (exists) {
        return prev.filter(f => f.id !== item.id)
      }
      return [...prev, item]
    })
  }

  function isFavourite(id: number) {
    return favourites.some(f => f.id === id)
  }

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouriteContext.Provider>
  )
}

export function useFavourite() {
  const context = useContext(FavouriteContext)
  if (!context) {
    throw new Error("useFavourite must be used within FavouriteProvider")
  }
  return context
}
