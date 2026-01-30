import { Link } from 'react-router-dom'

export default function Navbar() {
  return (<>
    <nav className="bg-blue-600 text-white flex justify-between p-4">
</nav>
    <nav className="w-full bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link to="/">Syrian Series</Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center">
          <li className="hover:text-pink-400 transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-pink-400 transition">
            <Link to="/series">Series</Link>
          </li>
          <li className="hover:text-pink-400 transition">
            <Link to="/movies">Movies</Link>
          </li>
          <li className="hover:text-pink-400 transition">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

      </div>
    </nav>
    </>
  )
}
