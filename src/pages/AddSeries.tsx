import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Series } from '../types/Series'

export default function AddSeries() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState(4)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newSeries = {
      id: crypto.randomUUID(), // ⭐ very important
      title,
      description,
      comments: [],
    };
    

    const existing = JSON.parse(
      localStorage.getItem('custom-series') || '[]'
    )

    localStorage.setItem('custom-series', JSON.stringify([...existing, newSeries]))

    navigate('/')
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">➕ Add New Series</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Series title"
          className="w-full p-3 rounded text-white bg-zinc-800"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          required
          placeholder="Image URL"
          className="w-full p-3 rounded bg-zinc-800"
          value={image}
          onChange={e => setImage(e.target.value)}
        />

        <input
          type="number"
          min={1}
          max={5}
          step={0.1}
          className="w-full p-3 rounded bg-zinc-800"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
        />

        <button className="w-full bg-pink-500 py-3 rounded font-bold">
          Add Series
        </button>
      </form>
    </div>
  )
}
