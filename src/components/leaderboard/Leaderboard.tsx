'use client'

import { Badge, Card, CardContent } from '@/components/ui'
import { formatINR } from '@/lib/utils'
import { Trophy, Medal, User, Sparkles } from 'lucide-react'

export interface LeaderboardEntry {
  position: number
  bid: {
    id: string
    amount: number
    createdAt: string
    user: {
      id: string
      name: string | null
      email: string
      avatar: string | null
    }
  }
  isCurrentUser: boolean
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  listingId: string
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-dark-100 flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-medium text-dark-900 mb-1">No promotions yet</h3>
          <p className="text-dark-500">Be the first to feature this listing and claim the #1 spotlight!</p>
        </CardContent>
      </Card>
    )
  }

  const top3 = entries.slice(0, 3)
  const remaining = entries.slice(3)

  return (
    <div className="space-y-6">
      {/* Top Ranks Display (Strictly as specified) */}
      <div className="grid gap-4 sm:grid-cols-3">
        {top3.map((entry) => {
          const isTop1 = entry.position === 1
          const isTop2 = entry.position === 2
          const isTop3 = entry.position === 3

          const brandName = entry.bid.user.name || entry.bid.user.email.split('@')[0] || 'Brand Partner'

          return (
            <div
              key={entry.bid.id}
              className={`relative rounded-2xl p-5 transition-all duration-300 ${
                isTop1
                  ? 'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                  : isTop2
                  ? 'bg-gradient-to-b from-slate-200/40 via-slate-100/20 to-white border border-slate-300 shadow-sm'
                  : 'bg-gradient-to-b from-amber-700/10 via-amber-700/5 to-white border border-amber-300 shadow-sm'
              } ${entry.isCurrentUser ? 'ring-2 ring-primary-500' : ''}`}
            >
              {/* Position Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center font-bold px-3 py-1 rounded-full text-sm ${
                      isTop1
                        ? 'bg-amber-500 text-white shadow-sm'
                        : isTop2
                        ? 'bg-slate-300 text-slate-800'
                        : 'bg-amber-700/20 text-amber-900'
                    }`}
                  >
                    #{entry.position} {isTop1 && '👑'}
                  </span>
                  {isTop1 && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Reigning Top
                    </span>
                  )}
                </div>
                {entry.isCurrentUser && (
                  <Badge variant="primary" size="sm">
                    You
                  </Badge>
                )}
              </div>

              {/* Brand Name */}
              <div className="mb-3">
                <h4 className="text-lg font-bold text-dark-900 truncate" title={brandName}>
                  {brandName}
                </h4>
                <p className="text-xs text-dark-500 truncate">{entry.bid.user.email}</p>
              </div>

              {/* Current Showcase Tier in INR */}
              <div className="pt-3 border-t border-dark-100/80">
                <p className="text-xs font-medium text-dark-500 uppercase tracking-wider">
                  Showcase Tier
                </p>
                <p
                  className={`text-2xl font-extrabold ${
                    isTop1 ? 'text-amber-600' : 'text-dark-900'
                  }`}
                >
                  {formatINR(entry.bid.amount)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Leaderboard Table */}
      <Card variant="outlined">
        <CardContent className="p-0">
          <div className="p-4 border-b border-dark-100 flex items-center justify-between">
            <h3 className="font-semibold text-dark-900">All Leaderboard Rankings</h3>
            <span className="text-xs text-dark-500">All listings in Indian Rupees (₹)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-50 border-b border-dark-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Brand Name / Partner
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Showcase Tier
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {entries.map((entry) => {
                  const isTop1 = entry.position === 1
                  const isTop2 = entry.position === 2
                  const isTop3 = entry.position === 3

                  const brandName = entry.bid.user.name || entry.bid.user.email.split('@')[0] || 'Brand Partner'

                  return (
                    <tr
                      key={entry.bid.id}
                      className={`transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-primary-50/70 font-medium'
                          : isTop1
                          ? 'bg-amber-50/40 hover:bg-amber-50/70'
                          : 'hover:bg-dark-50'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center font-bold text-sm px-2.5 py-0.5 rounded-full ${
                              isTop1
                                ? 'bg-amber-500 text-white'
                                : isTop2
                                ? 'bg-slate-300 text-slate-800'
                                : isTop3
                                ? 'bg-amber-700/20 text-amber-900'
                                : 'bg-dark-100 text-dark-700'
                            }`}
                          >
                            #{entry.position} {isTop1 && '👑'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 font-bold text-sm">
                            {entry.bid.user.avatar ? (
                              <img
                                src={entry.bid.user.avatar}
                                alt={brandName}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              brandName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-dark-900">
                              {brandName}
                              {entry.isCurrentUser && (
                                <span className="ml-2 text-xs text-primary-600 font-bold">(You)</span>
                              )}
                            </p>
                            <p className="text-xs text-dark-500 truncate max-w-[200px]">
                              {entry.bid.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-bold text-base text-dark-900">
                          {formatINR(entry.bid.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-dark-500">
                        {new Date(entry.bid.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CompactLeaderboard({
  entries,
  maxEntries = 3,
}: LeaderboardProps & { maxEntries?: number }) {
  const topEntries = entries.slice(0, maxEntries)

  return (
    <div className="space-y-2.5">
      {topEntries.map((entry) => {
        const isTop1 = entry.position === 1
        const brandName = entry.bid.user.name || entry.bid.user.email.split('@')[0] || 'Brand Partner'

        return (
          <div
            key={entry.bid.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              isTop1
                ? 'bg-amber-50 border border-amber-300 shadow-sm'
                : entry.isCurrentUser
                ? 'bg-primary-50 border border-primary-200'
                : 'bg-dark-50 hover:bg-dark-100'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                  isTop1
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-dark-200 text-dark-700'
                }`}
              >
                #{entry.position} {isTop1 && '👑'}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-dark-900 truncate text-sm">
                  {brandName}
                  {entry.isCurrentUser && ' (You)'}
                </p>
                <p className="text-xs text-dark-500">Showcase Tier: {formatINR(entry.bid.amount)}</p>
              </div>
            </div>

            <div className="text-right pl-2">
              <span className="font-bold text-dark-900 text-sm">{formatINR(entry.bid.amount)}</span>
            </div>
          </div>
        )
      })}
      {entries.length > maxEntries && (
        <div className="text-center py-1 text-xs text-dark-500">
          +{entries.length - maxEntries} more contenders
        </div>
      )}
    </div>
  )
}