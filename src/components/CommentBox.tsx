import { useState } from 'react'

export default function CommentBox() {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<string[]>([])

  return (
    <div className="mt-6">
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full p-3 rounded-xl border"
        placeholder="Write a comment..."
      />

      <button
        onClick={() => {
          if (comment.trim()) {
            setComments([...comments, comment])
            setComment('')
          }
        }}
        className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
      >
        Add Comment
      </button>

      <div className="mt-4 space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-100 p-3 rounded-xl">
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}
