'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'

const TYPES: Record<string, { label: string; color: string; bg: string }> = {
  feedback: { label: 'Feedback', color: '#F43F8F', bg: '#FFF0F6' },
  complaint: { label: 'Complaint', color: '#EF4444', bg: '#FFF5F5' },
  grievance: { label: 'Grievance', color: '#F97316', bg: '#FFF7ED' },
  feature_request: { label: 'Feature Request', color: '#8B5CF6', bg: '#F5F3FF' },
}

const STATUSES = ['open', 'in_progress', 'resolved', 'closed']
const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#F97316', bg: '#FFF7ED' },
  in_progress: { label: 'In Progress', color: '#3B82F6', bg: '#EFF6FF' },
  resolved: { label: 'Resolved', color: '#10B981', bg: '#ECFDF5' },
  closed: { label: 'Closed', color: '#6B7280', bg: '#F9FAFB' },
}

type FeedbackItem = {
  id: number
  name: string
  email: string
  type: string
  subject: string
  message: string
  status: string
  isPublic: boolean
  createdAt: string
  replies: {
    id: number
    message: string
    isAdmin: boolean
    authorName: string
    createdAt: string
  }[]
}

function FeedbackRow({ item, onUpdate }: { item: FeedbackItem; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [newStatus, setNewStatus] = useState(item.status)
  const [sending, setSending] = useState(false)

  const typeInfo = TYPES[item.type] || TYPES.feedback
  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.open

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/feedback/${item.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply.trim(), status: newStatus }),
      })
      if (res.ok) {
        toast.success('Reply sent')
        setReply('')
        onUpdate()
      } else {
        toast.error('Failed to send reply')
      }
    } catch (err) {
      console.error(err)
      toast.error('An error occurred')
    } finally {
      setSending(false)
    }
  }

  const updateStatus = async (status: string) => {
    setNewStatus(status)
    const res = await fetch(`/api/feedback/${item.id}/reply`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      toast.success(`Status updated to ${status}`)
      onUpdate()
    } else {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
          style={{ background: typeInfo.bg, color: typeInfo.color }}
        >
          #{item.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: typeInfo.color }}
            >
              {typeInfo.label}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {statusStyle.label}
            </span>
            {item.replies.some((r) => r.isAdmin) && (
              <span className="text-[9px] font-bold text-[#F43F8F] bg-rose-50 px-2 py-0.5 rounded-full">
                Replied
              </span>
            )}
          </div>
          <p className="font-semibold text-gray-800 text-sm truncate">{item.subject}</p>
          <p className="text-[11px] text-gray-400">
            {item.name} · {item.email} ·{' '}
            {new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-300 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 border-t border-gray-50 space-y-4">
              {/* Original message */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-4 mb-2">
                  Original Message
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {/* Status change */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Change Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      className="px-3 py-1 rounded-full text-[11px] font-bold border-2 transition-all"
                      style={{
                        borderColor: item.status === s ? STATUS_STYLES[s].color : 'transparent',
                        background: STATUS_STYLES[s].bg,
                        color: STATUS_STYLES[s].color,
                      }}
                    >
                      {STATUS_STYLES[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thread replies */}
              {item.replies.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Thread ({item.replies.length})
                  </p>
                  <div className="space-y-2">
                    {[...item.replies].reverse().map((r) => (
                      <div
                        key={r.id}
                        className={`flex gap-2 ${r.isAdmin ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold ${r.isAdmin ? 'bg-rose-100 text-[#F43F8F]' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {r.isAdmin ? 'DN' : r.authorName[0]}
                        </div>
                        <div
                          className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${r.isAdmin ? 'bg-gradient-to-br from-[#F43F8F] to-[#c73272] text-white rounded-tr-sm' : 'bg-gray-100 text-gray-700 rounded-tl-sm'}`}
                        >
                          {r.isAdmin && (
                            <p className="text-[8px] font-bold mb-0.5 text-white/70">ADMIN</p>
                          )}
                          {r.message}
                          <p
                            className={`text-[9px] mt-0.5 ${r.isAdmin ? 'text-white/50' : 'text-gray-400'}`}
                          >
                            {new Date(r.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply box */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Reply Publicly as Admin
                </p>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your public reply..."
                    className="flex-1 border border-rose-200 rounded-xl px-3 py-2 text-sm font-sans focus:border-[#F43F8F] focus:outline-none resize-none"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="shrink-0 w-10 h-10 mt-1 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #F43F8F, #c73272)' }}
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FeedbackManager() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      const res = await fetch('/api/feedback/admin')
      const data = await res.json()
      if (Array.isArray(data)) setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = items.filter((item) => {
    const matchStatus = filter === 'all' || item.status === filter
    const matchSearch =
      !search ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    all: items.length,
    open: items.filter((i) => i.status === 'open').length,
    in_progress: items.filter((i) => i.status === 'in_progress').length,
    resolved: items.filter((i) => i.status === 'resolved').length,
    closed: items.filter((i) => i.status === 'closed').length,
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-rose-300" />
      </div>
    )

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'open', label: 'Open', color: '#F97316' },
          { key: 'in_progress', label: 'In Progress', color: '#3B82F6' },
          { key: 'resolved', label: 'Resolved', color: '#10B981' },
          { key: 'closed', label: 'Closed', color: '#6B7280' },
        ].map((s) => (
          <div key={s.key} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {counts[s.key as keyof typeof counts]}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or subject..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 h-10 text-sm font-sans focus:border-[#F43F8F] focus:outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'open', 'in_progress', 'resolved', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${filter === s ? 'bg-[#F43F8F] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {s === 'all' ? `All (${counts.all})` : STATUS_STYLES[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-sans text-sm">No feedback matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <FeedbackRow key={item.id} item={item} onUpdate={load} />
          ))}
        </div>
      )}
    </div>
  )
}
