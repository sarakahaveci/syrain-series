type FavouriteItem = {
    id: number;
    title: string;
    image: string;
    rating: number;
};
type FavouriteContextType = {
    favourites: FavouriteItem[];
    toggleFavourite: (item: FavouriteItem) => void;
    isFavourite: (id: number) => boolean;
};
export declare const FavouriteContext: import("react").Context<FavouriteContextType>;
export declare function FavouriteProvider({ children }: {
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function useFavourite(): FavouriteContextType;
export {};
