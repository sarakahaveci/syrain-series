export interface Series {
  id: string
  title: string
  image: string
  rating: number
  comments: Comment[]
}

  export type Comment = {
    id: string
    text: string
    createdAt: string
  }
  
  