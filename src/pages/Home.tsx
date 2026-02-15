import { useEffect, useState } from 'react';
import { getPopularSeries } from '../api/tmdb';
import SeriesCard from '../components/SeriesCard';
import { getSeries } from '../services/seriesStore';
import {Series} from '../types/series'

type TMDBItem = {
    id: number
    name: string
    poster_path: string | null
    vote_average: number
  }
  
export default function Home() {
    const [allSeries, setAllSeries] = useState<Series[]>([])
    const [loading, setLoading] = useState(true);
          
    useEffect(() => {
        const loadData = async () => {
            try {
                const tmdbData = await getPopularSeries();
                const apiSeries = tmdbData.results.map((item: TMDBItem): Series => ({
                    id: item.id,
                    title: item.name,
                    image: item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : '/placeholder.jpg',
                    rating: item.vote_average / 2,
                  }))
                  
                const localSeries = getSeries();
                setAllSeries([...localSeries, ...apiSeries]);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
        // 🔥 listen to localStorage updates
        const onStorage = () => loadData();
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);
    if (loading) {
        return <p className="p-6 text-white">Loading...</p>;
    }
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {allSeries.map((series) => (<SeriesCard key={series.id} {...series}/>))}
    </div>);
}
