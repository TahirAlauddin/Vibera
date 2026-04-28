'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import {
  createCommentReply,
  createMoodComment,
  fetchMoodComments,
  type MoodComment,
} from '@/lib/mood-api'
import { formatTimeAgo } from '@/lib/mood-api'

type FeedCommentsProps = {
  moodId: number
  accessToken: string
  commentCount: number
  onCommentAdded: () => void
}

export function FeedComments({
  moodId,
  accessToken,
  commentCount,
  onCommentAdded,
}: FeedCommentsProps) {
  const [comments, setComments] = useState<MoodComment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMoodComments(accessToken, moodId)
      .then((data) => {
        if (!cancelled) setComments(data)
      })
      .catch(() => {
        if (!cancelled) setComments([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken, moodId, commentCount])

  const handleComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const created = await createMoodComment(accessToken, moodId, newComment.trim())
      setComments((prev) => [created, ...prev])
      setNewComment('')
      onCommentAdded()
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (e: FormEvent, commentId: number) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      await createCommentReply(accessToken, commentId, replyText.trim())
      const refreshed = await fetchMoodComments(accessToken, moodId)
      setComments(refreshed)
      setReplyText('')
      setReplyingTo(null)
      onCommentAdded()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border-t border-[#F4F6F1] px-5 pb-5 pt-4">
      <form onSubmit={handleComment} className="mb-4 flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] px-3 py-2 text-sm outline-none focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30"
        />
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="flex size-10 items-center justify-center rounded-xl bg-[#F6C531] text-[#1F2E13] disabled:opacity-50"
          aria-label="Post comment"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[#7A6B3F]">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#7A6B3F]">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="space-y-2">
              <div className="rounded-xl bg-[#FAF7E6] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#1F2E13]">@{comment.user}</span>
                  <span className="text-xs text-[#9CA3AF]">{formatTimeAgo(comment.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-[#4B5A41]">{comment.content}</p>
                <button
                  type="button"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="mt-1 text-xs font-medium text-[#7A6B3F] hover:text-[#1F2E13]"
                >
                  Reply
                </button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <ul className="ml-4 space-y-2 border-l-2 border-[#E0E6D9] pl-3">
                  {comment.replies.map((reply) => (
                    <li key={reply.id} className="rounded-xl bg-white px-3 py-2 ring-1 ring-[#F4F6F1]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#1F2E13]">@{reply.user}</span>
                        <span className="text-[10px] text-[#9CA3AF]">
                          {formatTimeAgo(reply.created_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#4B5A41]">{reply.content}</p>
                    </li>
                  ))}
                </ul>
              )}

              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleReply(e, comment.id)} className="ml-4 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to @${comment.user}`}
                    className="flex-1 rounded-xl border border-[#E0E6D9] bg-white px-3 py-2 text-sm outline-none focus:border-[#F6C531]"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !replyText.trim()}
                    className="rounded-xl bg-[#F6C531] px-3 py-2 text-xs font-semibold disabled:opacity-50"
                  >
                    Reply
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
