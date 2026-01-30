export type Series = {
  id: string
  title: string
  image: string
  rating: number
  description: string
}

export const seriesData: Series[] = [
  {
    id: '1',
    title: 'باب الحارة',
    image: 'https://via.placeholder.com/400x300',
    rating: 4.5,
    description: 'مسلسل سوري شهير'
  },
  {
    id: '2',
    title: 'الهيبة',
    image: 'https://via.placeholder.com/400x300',
    rating: 4.2,
    description: 'دراما اجتماعية'
  }
]
