export interface UpgradeLevelRow {
  level: number
  expNeeded: number | null
  bountyBase: number
  bountyV6: number
  bountyV10: number
  bountyV14: number
  activeTotal: number
  eliteExp: number
  shuraExp: number
  isEstimated?: boolean
}

export type StaminaBodies = 0 | 3 | 6 | 9

export const DAILY_STAMINA_SOURCES = {
  natural: 240,
  ramen: 150,
  friendGift: 50,
} as const

export const BASE_DAILY_STAMINA =
  DAILY_STAMINA_SOURCES.natural + DAILY_STAMINA_SOURCES.ramen + DAILY_STAMINA_SOURCES.friendGift

export interface UpgradeConfig {
  currentLevel: number
  currentExp: number
  targetLevel: number
  vipLevel: number
  superKage: boolean
  staminaBodies: StaminaBodies
  otherWeeklyStamina: number
  startDate: string
}

export interface UpgradeMilestone {
  fromLevel: number
  toLevel: number
  required: number
  deducted: number
  remaining: number
  dateReached: Date | null
}

export interface UpgradeDaySummary {
  date: Date
  addedStamina: number
  eliteRuns: number
  shuraRuns: number
  dungeonExp: number
  activeExp: number
  bountyExp: number
  remainingStamina: number
}

export interface UpgradeResult {
  days: number
  preciseDays: number
  completionDate: Date
  baseStamina: number
  remainingStamina: number
  milestones: UpgradeMilestone[]
  firstDay: UpgradeDaySummary | null
  totals: {
    dungeonExp: number
    activeExp: number
    bountyExp: number
    eliteRuns: number
    shuraRuns: number
  }
}

const CURRENT_UPGRADE_LEVEL_DATA: readonly Omit<UpgradeLevelRow, 'bountyBase'>[] = [
  { level: 140, expNeeded: 10035498, bountyV6: 104564.9208, bountyV10: 112033.9, bountyV14: 119502.8792, activeTotal: 75073.0752, eliteExp: 1607, shuraExp: 2142.131 },
  { level: 141, expNeeded: 11035498, bountyV6: 106555.3698, bountyV10: 114166.525, bountyV14: 121777.6802, activeTotal: 76502.1312, eliteExp: 1668, shuraExp: 2223.444 },
  { level: 142, expNeeded: 12035498, bountyV6: 108545.8188, bountyV10: 116299.15, bountyV14: 124052.4812, activeTotal: 77931.1872, eliteExp: 1729, shuraExp: 2304.757 },
  { level: 143, expNeeded: 13015782, bountyV6: 110536.2678, bountyV10: 118431.775, bountyV14: 126327.2822, activeTotal: 79360.2432, eliteExp: 1790, shuraExp: 2386.07 },
  { level: 144, expNeeded: 15045458, bountyV6: 112792.11, bountyV10: 120848.75, bountyV14: 128905.39, activeTotal: 80979.84, eliteExp: 1851, shuraExp: 2467.383 },
  { level: 145, expNeeded: 16045458, bountyV6: 116109.525, bountyV10: 124403.125, bountyV14: 132696.725, activeTotal: 83361.6, eliteExp: 1912, shuraExp: 2548.696 },
  { level: 146, expNeeded: 16545458, bountyV6: 119426.94, bountyV10: 127957.5, bountyV14: 136488.06, activeTotal: 85743.36, eliteExp: 1973, shuraExp: 2630.009 },
  { level: 147, expNeeded: 17045458, bountyV6: 134952.4422, bountyV10: 144591.975, bountyV14: 154231.5078, activeTotal: 96889.9968, eliteExp: 2034, shuraExp: 2711.322 },
  { level: 148, expNeeded: 17545458, bountyV6: 126061.77, bountyV10: 135066.25, bountyV14: 144070.73, activeTotal: 90506.88, eliteExp: 2095, shuraExp: 2792.635 },
  { level: 149, expNeeded: 18045458, bountyV6: 129379.185, bountyV10: 138620.625, bountyV14: 147862.065, activeTotal: 92888.64, eliteExp: 2156, shuraExp: 2873.948 },
  { level: 150, expNeeded: 18545458, bountyV6: 147094.1811, bountyV10: 157600.9875, bountyV14: 168107.7939, activeTotal: 105607.2384, eliteExp: 2217, shuraExp: 2955.261 },
  { level: 151, expNeeded: 19055458, bountyV6: 136014.015, bountyV10: 145729.375, bountyV14: 155444.735, activeTotal: 97652.16, eliteExp: 2278, shuraExp: 3036.574 },
  { level: 152, expNeeded: 19565458, bountyV6: 139331.43, bountyV10: 149283.75, bountyV14: 159236.07, activeTotal: 100033.92, eliteExp: 2338, shuraExp: 3116.554 },
  { level: 153, expNeeded: 20075458, bountyV6: 142648.845, bountyV10: 152838.125, bountyV14: 163027.405, activeTotal: 102415.68, eliteExp: 2392, shuraExp: 3188.536 },
  { level: 154, expNeeded: 20585458, bountyV6: 145966.26, bountyV10: 156392.5, bountyV14: 166818.74, activeTotal: 104797.44, eliteExp: 2446, shuraExp: 3260.518 },
  { level: 155, expNeeded: 21095458, bountyV6: 149283.675, bountyV10: 159946.875, bountyV14: 170610.075, activeTotal: 107179.2, eliteExp: 2500, shuraExp: 3332.5 },
  { level: 156, expNeeded: 21645458, bountyV6: 156250.2465, bountyV10: 167411.0625, bountyV14: 178571.8785, activeTotal: 112180.896, eliteExp: 2552, shuraExp: 3401.816 },
  { level: 157, expNeeded: 22195458, bountyV6: 156382.9431, bountyV10: 167553.2375, bountyV14: 178723.5319, activeTotal: 112276.1664, eliteExp: 2589, shuraExp: 3451.137 },
  { level: 158, expNeeded: 22745458, bountyV6: 156515.6397, bountyV10: 167695.4125, bountyV14: 178875.1853, activeTotal: 112371.4368, eliteExp: 2626, shuraExp: 3500.458 },
  { level: 159, expNeeded: 23295458, bountyV6: 156648.3363, bountyV10: 167837.5875, bountyV14: 179026.8387, activeTotal: 112466.7072, eliteExp: 2663, shuraExp: 3549.779 },
  { level: 160, expNeeded: 24665458, bountyV6: 156781.0329, bountyV10: 167979.7625, bountyV14: 179178.4921, activeTotal: 112561.9776, eliteExp: 2700, shuraExp: 3599.1 },
  { level: 161, expNeeded: 25485458, bountyV6: 156847.3812, bountyV10: 168050.85, bountyV14: 179254.3188, activeTotal: 112609.6128, eliteExp: 2720, shuraExp: 3625.76 },
  { level: 162, expNeeded: 26305458, bountyV6: 156913.7295, bountyV10: 168121.9375, bountyV14: 179330.1455, activeTotal: 112657.248, eliteExp: 2740, shuraExp: 3652.42 },
  { level: 163, expNeeded: 27125458, bountyV6: 156980.0778, bountyV10: 168193.025, bountyV14: 179405.9722, activeTotal: 112704.8832, eliteExp: 2760, shuraExp: 3679.08 },
  { level: 164, expNeeded: 27945458, bountyV6: 157046.4261, bountyV10: 168264.1125, bountyV14: 179481.7989, activeTotal: 112752.5184, eliteExp: 2780, shuraExp: 3705.74 },
  { level: 165, expNeeded: 29135458, bountyV6: 157112.7744, bountyV10: 168335.2, bountyV14: 179557.6256, activeTotal: 112800.1536, eliteExp: 2800, shuraExp: 3732.4 },
  { level: 166, expNeeded: 30325458, bountyV6: 157179.1227, bountyV10: 168406.2875, bountyV14: 179633.4523, activeTotal: 112847.7888, eliteExp: 2818, shuraExp: 3756.394 },
  { level: 167, expNeeded: 31515458, bountyV6: 187301.2509, bountyV10: 200680.0125, bountyV14: 214058.7741, activeTotal: 134474.1696, eliteExp: 2823, shuraExp: 3763.059 },
  { level: 168, expNeeded: 32705458, bountyV6: 157311.8193, bountyV10: 168548.4625, bountyV14: 179785.1057, activeTotal: 112943.0592, eliteExp: 2828, shuraExp: 3769.724 },
  { level: 169, expNeeded: 33895458, bountyV6: 157378.1676, bountyV10: 168619.55, bountyV14: 179860.9324, activeTotal: 112990.6944, eliteExp: 2833, shuraExp: 3776.389 },
  { level: 170, expNeeded: 35095458, bountyV6: 188296.4754, bountyV10: 201746.325, bountyV14: 215196.1746, activeTotal: 135190.0074, eliteExp: 2838, shuraExp: 3783.054 },
  { level: 171, expNeeded: 36295458, bountyV6: 157510.8642, bountyV10: 168761.725, bountyV14: 180012.5858, activeTotal: 113085.9648, eliteExp: 2843, shuraExp: 3790.219, isEstimated: true },
  { level: 172, expNeeded: 37495458, bountyV6: 157577.2125, bountyV10: 168832.8125, bountyV14: 180088.4125, activeTotal: 113133.6, eliteExp: 2848, shuraExp: 3796.884, isEstimated: true },
  { level: 173, expNeeded: 38695458, bountyV6: 157643.5608, bountyV10: 168903.9, bountyV14: 180164.2392, activeTotal: 113181.2352, eliteExp: 2853, shuraExp: 3803.549, isEstimated: true },
  { level: 174, expNeeded: 39895458, bountyV6: 157709.9091, bountyV10: 168974.9875, bountyV14: 180240.0659, activeTotal: 113228.8704, eliteExp: 2858, shuraExp: 3810.214, isEstimated: true },
  { level: 175, expNeeded: null, bountyV6: 0, bountyV10: 0, bountyV14: 0, activeTotal: 0, eliteExp: 0, shuraExp: 0, isEstimated: true },
]

const SCREENSHOT_BASE_BOUNTY: Record<number, number> = {
  110: 63789, 111: 64074, 112: 64453, 113: 64737, 114: 65069, 115: 65353, 116: 65638, 117: 66017, 118: 66301, 119: 66633,
  120: 66917, 121: 67296, 122: 67628, 123: 67912, 124: 68244, 125: 68576, 126: 68908, 127: 69192, 128: 69571, 129: 69903,
  130: 70235, 131: 70566, 132: 70851, 133: 71182, 134: 71609, 135: 71893, 136: 72225, 137: 72509, 138: 72936, 139: 73268,
  140: 74310, 141: 75827, 142: 77533, 143: 78955, 144: 80566, 145: 82936, 146: 85305, 147: 87675, 148: 90045, 149: 92414,
  150: 94784, 151: 97153, 152: 99523, 153: 101893, 154: 104262, 155: 106632, 156: 111608, 157: 111703, 158: 111798, 159: 111892,
  160: 111987, 161: 112034, 162: 112082, 163: 112129, 164: 112177, 165: 112224, 166: 112271, 167: 112319, 168: 112366, 169: 112414,
  170: 112461,
}

const createScreenshotRow = (level: number, expNeeded: number, activeTotal: number, eliteExpPerRun: number): Omit<UpgradeLevelRow, 'bountyBase'> => {
  const bountyBase = SCREENSHOT_BASE_BOUNTY[level]
  // 截图的精英数值为单次 5 体力；推演沿用每 10 体力的内部口径。
  const eliteExp = eliteExpPerRun * 2
  return {
    level,
    expNeeded,
    bountyV6: bountyBase * 1.4,
    bountyV10: bountyBase * 1.5,
    bountyV14: bountyBase * 1.6,
    activeTotal,
    eliteExp,
    shuraExp: eliteExp * 1.333,
  }
}

const SCREENSHOT_110_139_DATA = [
  createScreenshotRow(110, 983427, 64135, 673), createScreenshotRow(111, 1062630, 64413, 676), createScreenshotRow(112, 1142706, 64801, 680),
  createScreenshotRow(113, 1223613, 65087, 683), createScreenshotRow(114, 1305301, 65419, 686), createScreenshotRow(115, 1387799, 65721, 689),
  createScreenshotRow(116, 1471047, 66006, 692), createScreenshotRow(117, 1555149, 66369, 696), createScreenshotRow(118, 1639930, 66655, 699),
  createScreenshotRow(119, 1725438, 67006, 703), createScreenshotRow(120, 1512896, 67290, 706), createScreenshotRow(121, 1597826, 67654, 710),
  createScreenshotRow(122, 1597826, 67987, 713), createScreenshotRow(123, 1597826, 68271, 716), createScreenshotRow(124, 1498874, 68621, 720),
  createScreenshotRow(125, 2196307, 68937, 723), createScreenshotRow(126, 2298096, 69270, 727), createScreenshotRow(127, 2399884, 69555, 730),
  createScreenshotRow(128, 2501672, 69953, 734), createScreenshotRow(129, 2603461, 70268, 737), createScreenshotRow(130, 3803461, 70601, 741),
  createScreenshotRow(131, 4903461, 70935, 744), createScreenshotRow(132, 4903461, 71237, 747), createScreenshotRow(133, 4903461, 71569, 751),
  createScreenshotRow(134, 4903461, 71981, 755), createScreenshotRow(135, 5603461, 72266, 758), createScreenshotRow(136, 6203461, 72616, 762),
  createScreenshotRow(137, 7903461, 72901, 765), createScreenshotRow(138, 8403461, 73312, 769), createScreenshotRow(139, 9303461, 73644, 773),
] as const

const SCREENSHOT_140_170_DUNGEON_DATA: Record<number, { activeTotal: number; eliteExp: number; shuraExp: number; expNeeded?: number }> = {
  140: { activeTotal: 75074, eliteExp: 1576, shuraExp: 2100 }, 141: { activeTotal: 76217, eliteExp: 1600, shuraExp: 2130 },
  142: { activeTotal: 77914, eliteExp: 1636, shuraExp: 2180 }, 143: { activeTotal: 79342, eliteExp: 1666, shuraExp: 2220 },
  144: { activeTotal: 80980, eliteExp: 1700, shuraExp: 2266 }, 145: { activeTotal: 83362, eliteExp: 1750, shuraExp: 2322 },
  146: { activeTotal: 85724, eliteExp: 1800, shuraExp: 2399 }, 147: { activeTotal: 88105, eliteExp: 1850, shuraExp: 2466 },
  148: { activeTotal: 90507, eliteExp: 1900, shuraExp: 2532 }, 149: { activeTotal: 92889, eliteExp: 1950, shuraExp: 2599 },
  150: { activeTotal: 95271, eliteExp: 2000, shuraExp: 2666 }, 151: { activeTotal: 97654, eliteExp: 2050, shuraExp: 2732 },
  152: { activeTotal: 100035, eliteExp: 2100, shuraExp: 2799 }, 153: { activeTotal: 102416, eliteExp: 2150, shuraExp: 2865 },
  154: { activeTotal: 104798, eliteExp: 2200, shuraExp: 2932 }, 155: { activeTotal: 107180, eliteExp: 2250, shuraExp: 2999, expNeeded: 21095457 },
  156: { activeTotal: 112182, eliteExp: 2354, shuraExp: 3139 }, 157: { activeTotal: 112278, eliteExp: 2356, shuraExp: 3141 },
  158: { activeTotal: 112372, eliteExp: 2358, shuraExp: 3144 }, 159: { activeTotal: 112468, eliteExp: 2360, shuraExp: 3147 },
  160: { activeTotal: 112564, eliteExp: 2362, shuraExp: 3149 }, 161: { activeTotal: 112611, eliteExp: 2364, shuraExp: 3151 },
  162: { activeTotal: 112658, eliteExp: 2364, shuraExp: 3152 }, 163: { activeTotal: 112706, eliteExp: 2366, shuraExp: 3154 },
  164: { activeTotal: 112753, eliteExp: 2366, shuraExp: 3155 }, 165: { activeTotal: 112801, eliteExp: 2368, shuraExp: 3156 },
  166: { activeTotal: 112848, eliteExp: 2368, shuraExp: 3157 }, 167: { activeTotal: 112897, eliteExp: 2370, shuraExp: 3159 },
  168: { activeTotal: 112944, eliteExp: 2370, shuraExp: 3160 }, 169: { activeTotal: 112991, eliteExp: 2372, shuraExp: 3161 },
  170: { activeTotal: 113039, eliteExp: 2372, shuraExp: 3163 },
}

export const UPGRADE_LEVEL_DATA: readonly UpgradeLevelRow[] = [
  ...SCREENSHOT_110_139_DATA,
  ...CURRENT_UPGRADE_LEVEL_DATA,
].map((row) => {
  const bountyBase = SCREENSHOT_BASE_BOUNTY[row.level] ?? row.bountyV14 / 1.6
  const screenshotDungeon = SCREENSHOT_140_170_DUNGEON_DATA[row.level]
  return {
    ...row,
    ...(screenshotDungeon ?? {}),
    bountyBase,
    bountyV6: bountyBase * 1.4,
    bountyV10: bountyBase * 1.5,
    bountyV14: bountyBase * 1.6,
  }
})

const LEVEL_MAP = new Map(UPGRADE_LEVEL_DATA.map((row) => [row.level, row]))
const VALID_STAMINA_BODIES = new Set<number>([0, 3, 6, 9])
const MAX_SIMULATION_DAYS = 20_000
const DAILY_ELITE_STAMINA_LIMIT = 750

export const getUpgradeLevelData = (level: number) => LEVEL_MAP.get(level)

export function localDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseUpgradeDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('请选择有效的开始计算日期。')
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day, 12)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('请选择有效的开始计算日期。')
  }
  return date
}

export function formatUpgradeDate(value: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function validateLevels(currentLevel: number, targetLevel: number) {
  if (!LEVEL_MAP.has(currentLevel) || !LEVEL_MAP.has(targetLevel)) {
    throw new Error('等级必须在 110 到 175 之间。')
  }
  if (targetLevel < currentLevel) throw new Error('目标等级不能低于当前等级。')
}

function validateCurrentExperience(currentLevel: number, currentExp: number) {
  const threshold = getUpgradeLevelData(currentLevel)?.expNeeded
  if (!Number.isFinite(currentExp) || currentExp < 0) {
    throw new Error('当前经验必须是非负有限数字。')
  }
  if (threshold === null && currentExp !== 0) throw new Error('满级时当前经验只能为 0。')
  if (threshold !== null && threshold !== undefined && currentExp >= threshold) {
    throw new Error(`当前经验应在 0 到 ${Math.max(0, threshold - 1)} 之间。`)
  }
}

export function totalRemainingExperience(currentLevel: number, currentExp: number, targetLevel: number) {
  validateLevels(currentLevel, targetLevel)
  validateCurrentExperience(currentLevel, currentExp)
  if (targetLevel === currentLevel) return 0

  let total = -currentExp
  for (let level = currentLevel; level < targetLevel; level += 1) {
    const row = getUpgradeLevelData(level)
    if (!row || row.expNeeded === null) throw new Error(`缺少 ${level} 级升级经验。`)
    total += row.expNeeded
  }
  return Math.max(0, total)
}

function validateConfig(config: UpgradeConfig) {
  validateLevels(config.currentLevel, config.targetLevel)
  validateCurrentExperience(config.currentLevel, config.currentExp)
  if (!Number.isInteger(config.vipLevel) || config.vipLevel < 0 || config.vipLevel > 15) {
    throw new Error('V 特权等级必须在 V10 以下、V10—V13 或 V14—V15 三档之内。')
  }
  if (!VALID_STAMINA_BODIES.has(config.staminaBodies)) {
    throw new Error('每日买体必须选择不买、三体、六体或九体。')
  }
  if (!Number.isFinite(config.otherWeeklyStamina) || config.otherWeeklyStamina < 0) {
    throw new Error('其他每周体力必须是非负有限数字。')
  }
  return parseUpgradeDate(config.startDate)
}

function calculateBountyExperience(row: UpgradeLevelRow, vipLevel: number, superKage: boolean) {
  if (!superKage) return Math.round(row.bountyBase)
  const multiplier = vipLevel >= 14 ? 1.6 : vipLevel >= 10 ? 1.5 : 1.4
  return Math.round(row.bountyBase * multiplier)
}

type LegacyUpgradeConfig = Omit<UpgradeConfig, 'staminaBodies' | 'otherWeeklyStamina'> & {
  staminaBodies?: StaminaBodies
  otherWeeklyStamina?: number
}

export type UpgradeDungeonStrategy = 'eliteThenShura' | 'shuraOnly'

export function simulateUpgrade(
  config: LegacyUpgradeConfig,
  maxDays = MAX_SIMULATION_DAYS,
  dungeonStrategy: UpgradeDungeonStrategy = 'eliteThenShura',
): UpgradeResult {
  const normalized: UpgradeConfig = {
    ...config,
    staminaBodies: config.staminaBodies ?? 3,
    otherWeeklyStamina: config.otherWeeklyStamina ?? 0,
  }
  const startDate = validateConfig(normalized)
  const baseStamina =
    BASE_DAILY_STAMINA +
    (normalized.superKage ? 150 : 0) +
    normalized.staminaBodies * 50 +
    normalized.otherWeeklyStamina / 7
  const milestones: UpgradeMilestone[] = []

  for (let level = normalized.currentLevel; level < normalized.targetLevel; level += 1) {
    const row = getUpgradeLevelData(level)
    if (!row || row.expNeeded === null) throw new Error(`缺少 ${level} 级升级经验。`)
    const deducted = level === normalized.currentLevel ? normalized.currentExp : 0
    milestones.push({
      fromLevel: level,
      toLevel: level + 1,
      required: row.expNeeded,
      deducted,
      remaining: row.expNeeded - deducted,
      dateReached: null,
    })
  }

  const totals = { dungeonExp: 0, activeExp: 0, bountyExp: 0, eliteRuns: 0, shuraRuns: 0 }
  const averageDailyStamina = baseStamina
  const preciseDays = milestones.reduce((total, milestone) => {
    const row = getUpgradeLevelData(milestone.fromLevel)
    if (!row) throw new Error(`缺少 ${milestone.fromLevel} 级收益数据。`)
    const dungeonExp = dungeonStrategy === 'shuraOnly'
      ? (averageDailyStamina / 10) * row.shuraExp
      : (Math.min(averageDailyStamina, DAILY_ELITE_STAMINA_LIMIT) / 10) * row.eliteExp +
        (Math.max(0, averageDailyStamina - DAILY_ELITE_STAMINA_LIMIT) / 10) * row.shuraExp
    const bountyExp = calculateBountyExperience(row, normalized.vipLevel, normalized.superKage)
    return total + milestone.remaining / (dungeonExp + row.activeTotal + bountyExp)
  }, 0)

  if (normalized.targetLevel === normalized.currentLevel) {
    return {
      days: 0,
      preciseDays: 0,
      completionDate: startDate,
      baseStamina,
      remainingStamina: 0,
      milestones,
      firstDay: null,
      totals,
    }
  }

  let level = normalized.currentLevel
  let experience = normalized.currentExp
  let stamina = 0
  let dayIndex = 0
  let firstDay: UpgradeDaySummary | null = null

  const applyExperience = (amount: number, date: Date) => {
    experience += amount
    while (level < normalized.targetLevel) {
      const row = getUpgradeLevelData(level)
      if (!row || row.expNeeded === null || experience < row.expNeeded) break
      experience -= row.expNeeded
      const milestone = milestones.find((item) => item.fromLevel === level)
      if (milestone) milestone.dateReached = new Date(date)
      level += 1
    }
  }

  while (level < normalized.targetLevel && dayIndex < maxDays) {
    const date = addDays(startDate, dayIndex)
    const addedStamina = baseStamina
    stamina += addedStamina

    let eliteRunsToday = 0
    let shuraRunsToday = 0
    let dungeonExpToday = 0
    let activeExpToday = 0
    let bountyExpToday = 0

    if (dungeonStrategy === 'eliteThenShura') {
      while (level < normalized.targetLevel && eliteRunsToday < DAILY_ELITE_STAMINA_LIMIT / 10 && stamina >= 10) {
        const row = getUpgradeLevelData(level)
        if (!row) throw new Error(`缺少 ${level} 级精英副本经验。`)
        const reward = row.eliteExp
        stamina -= 10
        eliteRunsToday += 1
        totals.eliteRuns += 1
        totals.dungeonExp += reward
        dungeonExpToday += reward
        applyExperience(reward, date)
      }
    }

    while (level < normalized.targetLevel && stamina >= 10) {
      const row = getUpgradeLevelData(level)
      if (!row) throw new Error(`缺少 ${level} 级修罗副本经验。`)
      const reward = row.shuraExp
      stamina -= 10
      shuraRunsToday += 1
      totals.shuraRuns += 1
      totals.dungeonExp += reward
      dungeonExpToday += reward
      applyExperience(reward, date)
    }

    if (level < normalized.targetLevel) {
      const row = getUpgradeLevelData(level)
      if (!row) throw new Error(`缺少 ${level} 级活跃经验。`)
      activeExpToday = row.activeTotal
      totals.activeExp += activeExpToday
      applyExperience(activeExpToday, date)
    }

    if (level < normalized.targetLevel) {
      const row = getUpgradeLevelData(level)
      if (!row) throw new Error(`缺少 ${level} 级丰饶经验。`)
      bountyExpToday = calculateBountyExperience(row, normalized.vipLevel, normalized.superKage)
      totals.bountyExp += bountyExpToday
      applyExperience(bountyExpToday, date)
    }

    if (dayIndex === 0) {
      firstDay = {
        date,
        addedStamina,
        eliteRuns: eliteRunsToday,
        shuraRuns: shuraRunsToday,
        dungeonExp: dungeonExpToday,
        activeExp: activeExpToday,
        bountyExp: bountyExpToday,
        remainingStamina: stamina,
      }
    }
    dayIndex += 1
  }

  if (level < normalized.targetLevel) throw new Error('计算天数超过 20,000 天安全上限。')

  return {
    days: dayIndex,
    preciseDays,
    completionDate: addDays(startDate, dayIndex - 1),
    baseStamina,
    remainingStamina: stamina,
    milestones,
    firstDay,
    totals,
  }
}
