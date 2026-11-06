import fs from 'fs'
import path from 'path'
import prisma from './prisma'

export interface DailyAnalyticsState {
  date: string // YYYY-MM-DD in Asia/Kolkata (IST)
  todayVisitors: number
  totalViews: number
  lastUpdated: string
}

// Always compute date according to Indian Standard Time (Asia/Kolkata)
// This ensures midnight (12:00 AM) in India is the exact reset point.
export function getISTDateString(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
  } catch {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
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
 * - If Indian calendar date changed (midnight 12:00 AM IST): resets todayVisitors to 0 for the new day.
 * - If mid-day update or server restart: retains today's customer count intact (never resets mid-day!).
 */
export async function getLiveAnalyticsMetrics() {
  const todayIST = getISTDateString()

  // 1. Fetch from SQLite database
  const [viewsSetting, todayVisitorsSetting, todayDateSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'total_site_views' } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: 'today_site_visitors' } }).catch(() => null),
    prisma.setting.findUnique({ where: { key: 'today_visitors_date' } }).catch(() => null),
  ])

  // 2. Fetch from persistent file backup (survives code updates / restarts)
  const fileState = readStateFromFile()

  // Total views baseline (minimum 11563, continues accumulating forever)
  const dbViews = parseInt(viewsSetting?.value || '0', 10)
  const fileViews = fileState?.totalViews || 0
  const totalViews = Math.max(dbViews, fileViews, 11563)

  const dbDate = todayDateSetting?.value
  const fileDate = fileState?.date
  const effectiveSavedDate = dbDate || fileDate || todayIST

  let todayVisitors = 0

  if (effectiveSavedDate !== todayIST) {
    // Raat ke 12:00 AM midnight (calendar date change): reset to 0 for the brand new day
    todayVisitors = 0

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
    // Same day (mid-day update, code deploy or server restart):
    // RETAIN whatever visitors arrived today (never reset to 0 mid-day!)
    const dbTodayVisitors = parseInt(todayVisitorsSetting?.value || '0', 10)
    const fileTodayVisitors = fileState && fileState.date === todayIST ? fileState.todayVisitors : 0

    todayVisitors = Math.max(dbTodayVisitors, fileTodayVisitors)

    // Ensure database has todayIST date saved
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
 * Increments visitor count when a user arrives.
 * - Always increments total views (+1).
 * - Increments today's visitors (+1) for the current day.
 * - Saves to both SQLite and persistent state file.
 */
export async function recordNewVisitIncrement(isNewSession: boolean = true) {
  const current = await getLiveAnalyticsMetrics()
  const newTotalViews = current.totalViews + 1
  const newTodayVisitors = isNewSession ? current.todayVisitors + 1 : current.todayVisitors

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
      update: { value: current.todayIST },
      create: { key: 'today_visitors_date', value: current.todayIST },
    }).catch(() => {}),
  ])

  saveStateToFile({
    date: current.todayIST,
    todayVisitors: newTodayVisitors,
    totalViews: newTotalViews,
    lastUpdated: new Date().toISOString(),
  })

  return {
    totalViews: newTotalViews,
    todayVisitors: newTodayVisitors,
    todayIST: current.todayIST,
  }
}
