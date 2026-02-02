import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${query}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <nav className="w-full bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Syrian Series</Link>
        </h1>

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <ul className="hidden md:flex gap-6 items-center">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-series">Add Series</Link></li>
          <li><Link to="/">Series</Link></li>
          <li><Link to="/favorites">Favorites ❤️</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li>
            <form onSubmit={handleSubmit}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search series..."
                className="bg-zinc-800 px-3 py-1 rounded-md text-sm outline-none focus:ring-2 focus:ring-pink-500"
              />
            </form>
          </li>
        </ul>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4">
            <li><Link onClick={() => setOpen(false)} to="/">Home</Link></li>
            <li><Link onClick={() => setOpen(false)} to="/add-series">Add Series</Link></li>
            <li><Link onClick={() => setOpen(false)} to="/">Series</Link></li>
            <li><Link onClick={() => setOpen(false)} to="/favorites">Favorites ❤️</Link></li>
            <li><Link onClick={() => setOpen(false)} to="/movies">Movies</Link></li>
            <li><Link onClick={() => setOpen(false)} to="/contact">Contact</Link></li>
            <li>
              <form onSubmit={handleSubmit}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search series..."
                  className="w-full bg-zinc-800 px-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-pink-500"
                />
              </form>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
