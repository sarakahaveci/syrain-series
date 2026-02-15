import { Series } from "../types/Series"
import { seriesData } from '../components/data/series'
import { useState } from 'react'


let series: Series[] = []

export const getSeries = (): Series[] => series

export const addSeries = (item: Series): void => {
  const [series, setSeries] = useState<Series[]>([])

  const rawCustom = JSON.parse(
    localStorage.getItem('custom-series') || '[]'
  )

  const normalizedCustom: Series[] = rawCustom.map((item: any) => ({
    id: item.id,
    title: item.title || item.name,
    image: item.image || item.poster || '/placeholder.jpg',
    rating: item.rating || item.vote || 0,
  }))

}
