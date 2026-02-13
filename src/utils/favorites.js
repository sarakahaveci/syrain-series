const STORAGE_KEY = "favorites";
export function getFavorites() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}
export function addToFavorites(item) {
    const favorites = getFavorites();
    const exists = favorites.find(fav => fav.id === item.id);
    if (!exists) {
        favorites.push(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
}
export function removeFromFavorites(id) {
    const favorites = getFavorites().filter(fav => fav.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
export function isFavorite(id) {
    return getFavorites().some(fav => fav.id === id);
}
