import { useEffect, useState } from 'react'

type Comment = {
  id: string
  text: string
  createdAt: string
}

export default function CommentSection({ seriesId }: { seriesId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  // Load comments
  useEffect(() => {
    const stored = localStorage.getItem(`comments-${seriesId}`)
    if (stored) {
      setComments(JSON.parse(stored))
    }
  }, [seriesId])

  function saveComments(updated: Comment[]) {
    setComments(updated)
    localStorage.setItem(
      `comments-${seriesId}`,
      JSON.stringify(updated)
    )
  }

  function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    const newComment: Comment = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    }

    saveComments([newComment, ...comments])
    setText('')
  }

  function deleteComment(id: string) {
    saveComments(comments.filter(c => c.id !== id))
  }

  function startEdit(comment: Comment) {
    setEditingId(comment.id)
    setText(comment.text)
  }

  function saveEdit() {
    if (!editingId) return

    saveComments(
      comments.map(c =>
        c.id === editingId ? { ...c, text } : c
      )
    )

    setEditingId(null)
    setText('')
  }

  return (
    <div className="mt-12 border-t border-zinc-800 pt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {comments.length === 0 && (
        <p className="text-zinc-400 text-sm">No comments yet.</p>
      )}

      <div className="space-y-4 mb-6">
        {comments.map(comment => (
          <div
            key={comment.id}
            className="bg-zinc-900 p-4 rounded-md"
          >
            <p className="text-sm text-white">{comment.text}</p>
            <span className="text-xs text-zinc-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>

            {isAdmin && (
              <div className="flex gap-3 mt-2 text-xs">
                <button
                  onClick={() => startEdit(comment)}
                  className="text-yellow-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <form
          onSubmit={editingId ? saveEdit : addComment}
          className="space-y-3"
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-zinc-800 text-white p-3 rounded-md text-sm outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button className="bg-pink-600 px-4 py-2 rounded-md text-sm font-medium">
            {editingId ? 'Save Edit' : 'Add Comment'}
          </button>
        </form>
      )}
    </div>
  )
}
