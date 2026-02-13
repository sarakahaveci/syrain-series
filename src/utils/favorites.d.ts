export type FavoriteItem = {
    id: number;
    name: string;
    poster_path: string;
    vote_average: number;
    type: "tv" | "movie";
};
export declare function getFavorites(): FavoriteItem[];
export declare function addToFavorites(item: FavoriteItem): void;
export declare function removeFromFavorites(id: number): void;
export declare function isFavorite(id: number): boolean;
