import fs from 'fs'
import path from 'path'
import prisma from './prisma'

export interface DailyAnalyticsState {
  date: string // YYYY-MM-DD in Asia/Kolkata (IST)
  todayVisitors: number
  totalViews: number
  lastUpdated: string
}

// Global persistent in-memory store for deduplicating visitor sessions across requests
const globalForSeenSessions = global as unknown as {
  todaySeenSessions?: Set<string>
  todaySessionsDate?: string
  recentViewTimestamps?: Map<string, number>
}

if (!globalForSeenSessions.todaySeenSessions) {
  globalForSeenSessions.todaySeenSessions = new Set<string>()
  globalForSeenSessions.todaySessionsDate = ''
  globalForSeenSessions.recentViewTimestamps = new Map<string, number>()
}

/**
 * Returns exact Indian Standard Time (UTC + 5:30) date as YYYY-MM-DD.
 * Strictly cycles once every 24 hours at 12:00 AM midnight in India.
 * Immune to server host timezone or locale differences.
 */
export function getISTDateString(): string {
  const istDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
  return istDate.toISOString().slice(0, 10)
}

const STATE_FILE_PATH = path.join(process.cwd(), 'backups', 'daily_analytics_state.json')

function readStateFromFile(): DailyAnalyticsState | null {
  try {
    if (fs.existsSync(STATE_FILE_PATH)) {
      const content = fs.readFileSync(STATE_FILE_PATH, 'utf8')
      return JSON.parse(content) as DailyAnalyticsState
    }
  } catch (e) {
    // Ignore file read errors
  }
  return null
}

function saveStateToFile(state: DailyAnalyticsState): void {
  try {
    const dir = path.dirname(STATE_FILE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2), 'utf8')
  } catch (e) {
    // Ignore file write errors
  }
}

/**
 * Retrieves the current analytics metrics.
 * - 24-HOUR RESET: Resets today's visitor count to 0 ONLY ONCE every 24 hours at Indian midnight (12:00 AM IST).
 * - NEVER resets every 6 hours or on server restarts / process recycling.
 */
export async function getLiveAnalyticsMetrics() {
  const todayIST = getISTDateString()

  // 1. Fetch from SQLite database
  const [viewsSetting, todayVisitorsSetting, todayDateSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'total_site_views' } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: 'today_site_visitors' } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: 'today_visitors_date' } }).catch(() => null),
  ])

  // 2. Fetch from persistent file backup (survives process recycling)
  const fileState = readStateFromFile()

  // Total views baseline (minimum 11563, continues accumulating forever)
  const dbViews = parseInt(viewsSetting?.value || '0', 10)
  const fileViews = fileState?.totalViews || 0
  const totalViews = Math.max(dbViews, fileViews, 11563)

  const savedDate = todayDateSetting?.value || (fileState?.date === todayIST ? todayIST : null)
  let todayVisitors = 0

  // Check if Indian midnight (12:00 AM IST) has arrived for a new 24-hour day
  if (savedDate && savedDate !== todayIST) {
    // A FULL 24 HOURS HAS PASSED (Indian Midnight 12:00 AM reached)
    // Reset to 0 for the brand new day
    todayVisitors = 0

    // Clear deduplication set for the new day
    globalForSeenSessions.todaySeenSessions?.clear()
    globalForSeenSessions.todaySessionsDate = todayIST
    globalForSeenSessions.recentViewTimestamps?.clear()

    await Promise.all([
      prisma.setting.upsert({
        where: { key: 'today_visitors_date' },
        update: { value: todayIST },
        create: { key: 'today_visitors_date', value: todayIST },
      }).catch(() => {}),
      prisma.setting.upsert({
        where: { key: 'today_site_visitors' },
        update: { value: '0' },
        create: { key: 'today_site_visitors', value: '0' },
      }).catch(() => {}),
    ])

    saveStateToFile({
      date: todayIST,
      todayVisitors: 0,
      totalViews,
      lastUpdated: new Date().toISOString(),
    })
  } else {
    // STILL THE SAME 24-HOUR DAY (or fresh server startup):
    // RETAIN today's customer count intact (never reset to 0 mid-day or every 6 hours!)
    const dbTodayVisitors = parseInt(todayVisitorsSetting?.value || '0', 10)
    const fileTodayVisitors = fileState && fileState.date === todayIST ? fileState.todayVisitors : 0

    todayVisitors = Math.max(dbTodayVisitors, fileTodayVisitors)

    // Ensure database date matches today's IST date without resetting count
    if (todayDateSetting?.value !== todayIST) {
      await prisma.setting.upsert({
        where: { key: 'today_visitors_date' },
        update: { value: todayIST },
        create: { key: 'today_visitors_date', value: todayIST },
      }).catch(() => {})
    }
  }

  return {
    totalViews,
    todayVisitors,
    todayIST,
  }
}

/**
 * Records a visitor and increments counters with strict session deduplication:
 * - 1 visitor is counted as EXACTLY 1 (never counted twice for multiple requests or double-mount).
 * - Total views increments (+1).
 * - Debounces rapid duplicate calls within 5 seconds.
 */
export async function recordNewVisitIncrement(
  sessionId?: string,
  clientIp?: string,
  isNewSession: boolean = true
) {
  const current = await getLiveAnalyticsMetrics()
  const todayIST = current.todayIST

  // Deduplication Key (unique to each visitor's browser session)
  const sessionKey = (sessionId && sessionId !== 'undefined') 
    ? sessionId 
    : (clientIp && clientIp !== 'client' ? clientIp : `anon_${Date.now()}`)

  // Reset in-memory session set if date changed
  if (globalForSeenSessions.todaySessionsDate !== todayIST) {
    globalForSeenSessions.todaySeenSessions?.clear()
    globalForSeenSessions.todaySessionsDate = todayIST
    globalForSeenSessions.recentViewTimestamps?.clear()
  }

  // Prevent double-counting if duplicate request arrives within 5 seconds (React StrictMode / double effect)
  const now = Date.now()
  const recentTimestamps = globalForSeenSessions.recentViewTimestamps || new Map<string, number>()
  const lastTime = recentTimestamps.get(sessionKey) || 0
  const isDuplicateCall = (now - lastTime) < 5000
  recentTimestamps.set(sessionKey, now)

  // Determine if this is a genuinely new unique visitor today
  const hasSeenSessionToday = globalForSeenSessions.todaySeenSessions?.has(sessionKey) || false
  const shouldIncrementVisitor = isNewSession && !hasSeenSessionToday && !isDuplicateCall

  if (shouldIncrementVisitor) {
    globalForSeenSessions.todaySeenSessions?.add(sessionKey)
  }

  const newTodayVisitors = shouldIncrementVisitor 
    ? current.todayVisitors + 1 
    : current.todayVisitors

  const newTotalViews = !isDuplicateCall 
    ? current.totalViews + 1 
    : current.totalViews

  // Only write to DB if metrics actually changed
  if (shouldIncrementVisitor || !isDuplicateCall) {
    await Promise.all([
      prisma.setting.upsert({
        where: { key: 'total_site_views' },
        update: { value: String(newTotalViews) },
        create: { key: 'total_site_views', value: String(newTotalViews) },
      }).catch(() => {}),
      prisma.setting.upsert({
        where: { key: 'today_site_visitors' },
        update: { value: String(newTodayVisitors) },
        create: { key: 'today_site_visitors', value: String(newTodayVisitors) },
      }).catch(() => {}),
      prisma.setting.upsert({
        where: { key: 'today_visitors_date' },
        update: { value: todayIST },
        create: { key: 'today_visitors_date', value: todayIST },
      }).catch(() => {}),
    ])

    saveStateToFile({
      date: todayIST,
      todayVisitors: newTodayVisitors,
      totalViews: newTotalViews,
      lastUpdated: new Date().toISOString(),
    })
  }

  return {
    totalViews: newTotalViews,
    todayVisitors: newTodayVisitors,
    todayIST,
  }
}
