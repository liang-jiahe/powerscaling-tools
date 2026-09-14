import {
  BarChart3,
  BookOpenText,
  CalendarDays,
  ChevronRight,
  Clock3,
  Gift,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { NumberField } from '../components'
import { ThemedSelect } from '../ThemedSelect'
import {
  BASE_DAILY_STAMINA,
  DAILY_STAMINA_SOURCES,
  UPGRADE_LEVEL_DATA,
  formatUpgradeDate,
  getUpgradeLevelData,
  localDateInputValue,
  simulateUpgrade,
  totalRemainingExperience,
  type StaminaBodies,
  type UpgradeConfig,
} from './calculator'
import './upgrade.css'

const LEVELS = UPGRADE_LEVEL_DATA.map((item) => item.level)
const VIP_LEVELS = [
  { value: 6, label: 'V10 以下' },
  { value: 10, label: 'V10—V13' },
  { value: 14, label: 'V14—V15' },
]
const STAMINA_OPTIONS: Array<{ value: StaminaBodies; label: string; hint: string }> = [
  { value: 0, label: '不买体力', hint: `每日基础 ${BASE_DAILY_STAMINA} 体力` },
  { value: 3, label: '三体', hint: '额外 150 体力' },
  { value: 6, label: '六体', hint: '额外 300 体力' },
  { value: 9, label: '九体', hint: '额外 450 体力' },
]

const formatInteger = (value: number) =>
  new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)

const formatDays = (value: number) =>
  new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Number.isFinite(value) ? value : 0,
  )

const vipTierLabel = (level: number) =>
  level >= 14 ? 'V14—V15' : level >= 10 ? 'V10—V13' : 'V10 以下'

const createDefaultConfig = (): UpgradeConfig => ({
  currentLevel: 140,
  currentExp: 0,
  targetLevel: 150,
  vipLevel: 14,
  superKage: true,
  staminaBodies: 3,
  otherWeeklyStamina: 500,
  startDate: localDateInputValue(),
})

export function UpgradeCalculator({ resetSignal }: { resetSignal: number }) {
  const [form, setForm] = useState<UpgradeConfig>(createDefaultConfig)
  const [submitted, setSubmitted] = useState<UpgradeConfig>(createDefaultConfig)
  const [error, setError] = useState('')

  useEffect(() => {
    if (resetSignal === 0) return
    const next = createDefaultConfig()
    setForm(next)
    setSubmitted(next)
    setError('')
  }, [resetSignal])

  const result = useMemo(() => simulateUpgrade(submitted), [submitted])
  const remainingExperience = useMemo(
    () => totalRemainingExperience(submitted.currentLevel, submitted.currentExp, submitted.targetLevel),
    [submitted],
  )
  const currentThreshold = getUpgradeLevelData(form.currentLevel)?.expNeeded ?? 0
  const purchasedStamina = form.staminaBodies * 50
  const otherDailyStamina = form.otherWeeklyStamina / 7
  const baseStamina = BASE_DAILY_STAMINA + (form.superKage ? 150 : 0) + purchasedStamina + otherDailyStamina

  const update = <K extends keyof UpgradeConfig>(key: K, value: UpgradeConfig[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const changeSuperKage = (superKage: boolean) => {
    setForm((current) => {
      const next = { ...current, superKage }
      setSubmitted(next)
      return next
    })
    setError('')
  }

  const changeCurrentLevel = (currentLevel: number) => {
    const threshold = getUpgradeLevelData(currentLevel)?.expNeeded
    setForm((current) => ({
      ...current,
      currentLevel,
      currentExp: Math.min(current.currentExp, Math.max(0, (threshold ?? 1) - 1)),
      targetLevel: Math.max(current.targetLevel, currentLevel),
    }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      simulateUpgrade(form)
      setSubmitted({ ...form })
      setError('')
      window.requestAnimationFrame(() => document.getElementById('upgrade-results')?.scrollIntoView({ block: 'start' }))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '升级时间计算失败。')
    }
  }

  return (
    <div className="upgrade-workspace" id="upgrade-top">
      <section className="upgrade-hero">
        <div className="upgrade-hero-copy">
          <h1>升级时间计算</h1>
        </div>
      </section>

      <div className="upgrade-layout">
        <aside className="upgrade-form-card">
          <div className="upgrade-section-title">
            <span>01</span>
            <div><small>角色状态</small><h2>开始推演</h2></div>
          </div>

          <form onSubmit={submit}>
            <div className="upgrade-form-grid two">
              <ThemedSelect
                label="当前等级"
                value={form.currentLevel}
                options={LEVELS.map((level) => ({ value: level, label: `${level} 级` }))}
                onChange={changeCurrentLevel}
              />
              <ThemedSelect
                label="目标等级"
                value={form.targetLevel}
                options={LEVELS.filter((level) => level >= form.currentLevel).map((level) => ({
                  value: level,
                  label: `${level} 级`,
                }))}
                onChange={(targetLevel) => update('targetLevel', targetLevel)}
              />
            </div>

            <NumberField
              label="本级已有经验"
              value={form.currentExp}
              max={Math.max(0, currentThreshold - 1)}
              suffix="经验"
              onChange={(currentExp) => update('currentExp', currentExp)}
            />
            <p className="upgrade-field-help">
              本级上限：{currentThreshold ? formatInteger(currentThreshold) : '已满级'}；清空时按 0 计算。
            </p>

            <div className="upgrade-divider" />

            <div className="upgrade-form-grid two">
              <ThemedSelect
                label="V 特权等级"
                value={form.vipLevel}
                options={VIP_LEVELS}
                onChange={(vipLevel) => update('vipLevel', vipLevel)}
              />
              <label className="field upgrade-date-field">
                <span>开始日期</span>
                <div className="input-shell">
                  <CalendarDays size={16} aria-hidden="true" />
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) => update('startDate', event.target.value)}
                  />
                </div>
              </label>
            </div>

            <label className="upgrade-toggle">
              <span><b>超影特权</b><small>拉面体力由 150 提升至 300</small></span>
              <input
                type="checkbox"
                checked={form.superKage}
                onChange={(event) => changeSuperKage(event.target.checked)}
              />
              <i aria-hidden="true" />
            </label>

            <ThemedSelect
              label="每日买体"
              value={form.staminaBodies}
              options={STAMINA_OPTIONS}
              onChange={(staminaBodies) => update('staminaBodies', staminaBodies)}
            />

            <NumberField
              label="其他每周体力"
              value={form.otherWeeklyStamina}
              suffix="体力/周"
              onChange={(otherWeeklyStamina) => update('otherWeeklyStamina', otherWeeklyStamina)}
            />
            <p className="upgrade-field-help">
              V 特权、心悦和活动等其他来源；按每周总量 ÷ 7 平均计入每日体力。
            </p>

            <div className="upgrade-stamina-strip">
              <span>每日固定体力</span>
              <strong>{formatInteger(baseStamina)}</strong>
              <small>
                自然 {DAILY_STAMINA_SOURCES.natural} + 拉面 {form.superKage ? '300' : DAILY_STAMINA_SOURCES.ramen}
                {' '}+ 好友 {DAILY_STAMINA_SOURCES.friendGift}
                {purchasedStamina ? ` + 买体 ${purchasedStamina}` : ''}
                {form.otherWeeklyStamina ? ` + 其他日均 ${formatInteger(otherDailyStamina)}` : ''}
              </small>
            </div>

            {error && <p className="upgrade-error" role="alert">{error}</p>}

            <button className="upgrade-submit" type="submit">
              <Clock3 size={18} /><span>推演升级时间</span><ChevronRight size={18} />
            </button>
          </form>
        </aside>

        <section className="upgrade-results" id="upgrade-results" aria-live="polite">
          <div className="upgrade-results-head">
            <div className="upgrade-section-title">
              <span>02</span>
              <div><small>逐日计算结果</small><h2>冲级路线</h2></div>
            </div>
            <div className="upgrade-config-chip">
              {vipTierLabel(submitted.vipLevel)} · {submitted.superKage ? '超影' : '非超影'} ·
              {submitted.staminaBodies === 0 ? ' 不买体' : ` ${submitted.staminaBodies} 体`}
            </div>
          </div>

          <div className="upgrade-summary-grid">
            <article className="upgrade-summary primary">
              <span>预计需要</span>
              <strong>{formatDays(result.preciseDays)}<small>天</small></strong>
              <p>按平均每日收益精确计算</p>
            </article>
            <article className="upgrade-summary mint">
              <span>预计完成</span>
              <strong className="date">{formatUpgradeDate(result.completionDate)}</strong>
              <p>{submitted.currentLevel} 级 → {submitted.targetLevel} 级</p>
            </article>
            <article className="upgrade-summary yellow">
              <span>尚需经验</span>
              <strong>{formatInteger(remainingExperience)}</strong>
              <p>已抵扣本级现有经验</p>
            </article>
            <article className="upgrade-summary pink">
              <span>每日基础体力</span>
              <strong>{formatInteger(result.baseStamina)}</strong>
              <p>{submitted.otherWeeklyStamina ? '已含其他每周体力日均' : '不含其他每周体力'}</p>
            </article>
          </div>

          <div className="upgrade-rule">
            <Sparkles size={18} />
            <p>每日按 <b>精英 → 修罗 → 活跃合计 → 丰饶</b> 的顺序计算，升级后立即切换新等级经验。</p>
          </div>

          <div className="upgrade-detail-grid">
            <article className="upgrade-detail-card">
              <div className="upgrade-card-title">
                <div><small>全程收益</small><h3>经验来源</h3></div>
                <BarChart3 size={18} />
              </div>
              <dl className="upgrade-source-list">
                <div><dt><i className="mint-dot" />副本扫荡</dt><dd>{formatInteger(result.totals.dungeonExp)}</dd></div>
                <div><dt><i className="blue-dot" />活跃合计</dt><dd>{formatInteger(result.totals.activeExp)}</dd></div>
                <div><dt><i className="pink-dot" />丰饶之间</dt><dd>{formatInteger(result.totals.bountyExp)}</dd></div>
              </dl>
              <div className="upgrade-run-stats">
                <span>精英 <b>{formatInteger(result.totals.eliteRuns)}</b> 次</span>
                <span>修罗 <b>{formatInteger(result.totals.shuraRuns)}</b> 次</span>
                <span>结余 <b>{formatInteger(result.remainingStamina)}</b> 体力</span>
              </div>
            </article>

            <article className="upgrade-detail-card">
              <div className="upgrade-card-title">
                <div><small>第一天预览</small><h3>当日收益</h3></div>
                <span>{result.firstDay ? formatUpgradeDate(result.firstDay.date) : '—'}</span>
              </div>
              {result.firstDay ? (
                <dl className="upgrade-source-list compact">
                  <div><dt>获得体力</dt><dd>{formatInteger(result.firstDay.addedStamina)}</dd></div>
                  <div><dt>精英 / 修罗</dt><dd>{result.firstDay.eliteRuns} / {result.firstDay.shuraRuns}</dd></div>
                  <div><dt>副本经验</dt><dd>{formatInteger(result.firstDay.dungeonExp)}</dd></div>
                  <div><dt>活跃合计</dt><dd>{formatInteger(result.firstDay.activeExp)}</dd></div>
                  <div><dt>加成后丰饶</dt><dd>{formatInteger(result.firstDay.bountyExp)}</dd></div>
                </dl>
              ) : <p className="upgrade-empty">当前等级已经达到目标等级。</p>}
            </article>
          </div>

          <details className="upgrade-table-card">
            <summary className="upgrade-card-title">
              <div><small>逐级里程碑</small><h3>升级进度表</h3></div>
              <span>{result.milestones.length} 个阶段 · 点击展开</span>
            </summary>
            <div className="upgrade-table-scroll">
              <table>
                <thead><tr><th>升级阶段</th><th>该级所需</th><th>已有抵扣</th><th>本阶段尚需</th><th>预计到达</th></tr></thead>
                <tbody>
                  {result.milestones.map((milestone) => (
                    <tr key={milestone.fromLevel}>
                      <td><b>{milestone.fromLevel}</b> → <b>{milestone.toLevel}</b></td>
                      <td>{formatInteger(milestone.required)}</td>
                      <td>{formatInteger(milestone.deducted)}</td>
                      <td>{formatInteger(milestone.remaining)}</td>
                      <td>{milestone.dateReached ? formatUpgradeDate(milestone.dateReached) : '—'}</td>
                    </tr>
                  ))}
                  {result.milestones.length === 0 && (
                    <tr><td colSpan={5}>当前等级已经达到目标等级。</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      </div>

      <details className="upgrade-reference" id="upgrade-reference">
        <summary>
          <span>查看 110—175 级经验表</span>
          <b aria-hidden="true">＋</b>
        </summary>
        <div className="upgrade-table-scroll">
          <table>
            <thead><tr><th>等级</th><th>升级所需经验</th><th>非超影丰饶</th><th>超影 V10 以下</th><th>超影 V10—V13</th><th>超影 V14—V15</th><th>活跃合计</th><th>精英副本（每 10 体）</th><th>修罗副本（每 10 体）</th></tr></thead>
            <tbody>
              {UPGRADE_LEVEL_DATA.map((row) => (
                <tr key={row.level}>
                  <td><b>{row.level}</b></td>
                  <td>{row.expNeeded ? formatInteger(row.expNeeded) : '满级'}</td>
                  <td>{formatInteger(row.bountyBase)}</td>
                  <td>{formatInteger(row.bountyV6)}</td>
                  <td>{formatInteger(row.bountyV10)}</td>
                  <td>{formatInteger(row.bountyV14)}</td>
                  <td>{formatInteger(row.activeTotal)}</td>
                  <td>{formatInteger(row.eliteExp)}</td>
                  <td>{formatInteger(row.shuraExp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div className="upgrade-footnote">
        <BookOpenText size={16} />
        <p>110—170 级经验与收益依据截图表整理；丰饶关闭超影时使用基础经验，开启后按 V 档位倍率计算；副本经验不受超影影响。171—175 级仍为推算数据。</p>
        <Gift size={16} />
      </div>
    </div>
  )
}
