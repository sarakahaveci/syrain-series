export type FavoriteItem = {
    id: number;
    name: string;
    poster_path: string;
    vote_average: number;
    type: "tv" | "movie";
  };
  
  const STORAGE_KEY = "favorites";
  
  export function getFavorites(): FavoriteItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  export function addToFavorites(item: FavoriteItem) {
    const favorites = getFavorites();
    const exists = favorites.find(fav => fav.id === item.id);
  
    if (!exists) {
      favorites.push(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }
  
  export function removeFromFavorites(id: number) {
    const favorites = getFavorites().filter(fav => fav.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
  
  export function isFavorite(id: number): boolean {
    return getFavorites().some(fav => fav.id === id);
  }
  