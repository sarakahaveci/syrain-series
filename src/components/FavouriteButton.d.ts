import { ReactNode } from 'react';
export type FavouriteContextType = {
    favorites: string[];
    toggleFavorite: (id: string) => void;
};
export declare const FavouriteProvider: ({ children }: {
    children: ReactNode;
}) => import("react").JSX.Element;
export declare const useFavourite: () => FavouriteContextType;
