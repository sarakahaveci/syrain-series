import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSeriesDetails } from '../services/tmdb'
import RatingStars from '../components/RatingStars'
import { Series } from '../types/Series'
import CommentSection from '../components/CommentSection'

type Comment = {
  id: string
  text: string
  createdAt: string
}

export default function SeriesDetails() {
  const { id } = useParams<{ id: string }>()

  const [series, setSeries] = useState<Series | any>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    if (!id) return

    // ✅ load comments
    const stored = localStorage.getItem(`comments-${id}`)
    if (stored) {
      setComments(JSON.parse(stored))
    }

    // 1️⃣ check locally added series
    const localSeries: Series[] = JSON.parse(
      localStorage.getItem('custom-series') || '[]'
    )

    const foundLocal = localSeries.find(s => s.id.toString() === id)

    if (foundLocal) {
      setSeries(foundLocal)
      setLoading(false)
      return
    }

    // 2️⃣ fetch from TMDB
    getSeriesDetails(id).then(data => {
      setSeries(data)
      setLoading(false)
    })
  }, [id])

  if (!id) {
    return <p className="text-center mt-10">Invalid series</p>
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  if (!series) {
    return <p className="text-center mt-10">Series not found</p>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <img
        src={
          series.image
            ? series.image
            : `https://image.tmdb.org/t/p/w500${series.poster_path}`
        }
        className="rounded-xl mb-6 w-full max-h-[500px] object-cover"
      />

      <h1 className="text-3xl font-bold mb-2">
        {series.title || series.name}
      </h1>

      <RatingStars
        rating={series.rating ? series.rating : series.vote_average / 2}
      />

      <p className="mt-4 text-gray-900">
        {series.overview || 'No description available.'}
      </p>

      {/* ✅ COMMENTS */}
      <CommentSection seriesId={id} />
    </div>
  )
}
