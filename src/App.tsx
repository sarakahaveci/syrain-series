import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SeriesCard from './components/SeriesCard'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Movies from './pages/Movies'
import SeriesDetails from './pages/SeriesDetails'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series/:id" element={<SeriesDetails />} />
        {/* <Route path="/seriescard/:id" element={<SeriesCard />} /> */}
        <Route path="/movies/:id" element={<Movies />} />
        <Route path="/contact/:id" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
