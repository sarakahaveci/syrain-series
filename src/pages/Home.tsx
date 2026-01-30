import { seriesData, Series } from '../components/data/sereies'
import SeriesCard from '../components/SeriesCard'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <>
    <Navbar/>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {seriesData.map((series: Series) => (
        <SeriesCard key={series.id} {...series} />
      ))}
    </div>
    </>
  )
}
