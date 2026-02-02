import { Series } from '../types/Series'
import { seriesData } from '../components/data/series'

export function getAllSeries(): Series[] {
  const rawCustom = JSON.parse(
    localStorage.getItem('custom-series') || '[]'
  )

  const normalizedCustom: Series[] = rawCustom.map((item: any) => ({
    id: item.id,
    title: item.title || item.name,
    image: item.image || item.poster || '/placeholder.jpg',
    rating: item.rating || item.vote || 0,
    comments: item.comments || [], // ✅ REQUIRED
  }))

 const normalizedApi: Series[] = seriesData.map((item: any) => ({
  id: String(item.id),
  title: item.title || item.name,
  image: item.image || item.poster || '/placeholder.jpg',
  rating: item.rating || item.vote || 0,
  comments: [],
}))


  return [...normalizedApi, ...normalizedCustom]
}
