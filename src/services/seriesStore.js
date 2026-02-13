import { seriesData } from '../components/data/series';
export function getAllSeries() {
    const rawCustom = JSON.parse(localStorage.getItem('custom-series') || '[]');
    const normalizedCustom = rawCustom.map((item) => ({
        id: item.id,
        title: item.title || item.name,
        image: item.image || item.poster || '/placeholder.jpg',
        rating: item.rating || item.vote || 0,
    }));
    return [...seriesData, ...normalizedCustom];
}
