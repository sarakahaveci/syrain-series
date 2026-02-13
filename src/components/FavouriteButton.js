import { createContext, useContext, useState } from 'react';
const FavouriteContext = createContext(undefined);
export const FavouriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const toggleFavorite = (id) => {
        setFavorites((prev) => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };
    return (<FavouriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavouriteContext.Provider>);
};
export const useFavourite = () => {
    const context = useContext(FavouriteContext);
    if (!context)
        throw new Error('useFavourite must be used within FavouriteProvider');
    return context;
};
