const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export async function getPopularSeries() {
  const res = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ar`
  )

  if (!res.ok) {
    throw new Error('Failed to fetch series')
  }

  return res.json()
}

export async function searchSeries(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  )

  if (!res.ok) {
    throw new Error('Search failed')
  }

  return res.json()
}
