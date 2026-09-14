import { describe, expect, it } from 'vitest'
import {
  UPGRADE_LEVEL_DATA,
  getUpgradeLevelData,
  simulateUpgrade,
  totalRemainingExperience,
  type UpgradeConfig,
} from './calculator'

const baseConfig: UpgradeConfig = {
  currentLevel: 140,
  currentExp: 0,
  targetLevel: 141,
  vipLevel: 10,
  superKage: false,
  staminaBodies: 3,
  otherWeeklyStamina: 0,
  startDate: '2026-07-29',
}

describe('升级经验数据', () => {
  it('收录截图的 110—170 级数据，并保留 171—175 级推算区间', () => {
    expect(UPGRADE_LEVEL_DATA).toHaveLength(66)
    expect(UPGRADE_LEVEL_DATA[0]).toMatchObject({
      level: 110,
      expNeeded: 983_427,
      bountyBase: 63_789,
      activeTotal: 64_135,
      eliteExp: 1_346,
    })
    expect(getUpgradeLevelData(150)).toMatchObject({
      expNeeded: 18_545_458,
      bountyBase: 94_784,
      activeTotal: 95_271,
      eliteExp: 2_000,
      shuraExp: 2_666,
    })
    expect(getUpgradeLevelData(155)).toMatchObject({ expNeeded: 21_095_457, eliteExp: 2_250, shuraExp: 2_999 })
    expect(getUpgradeLevelData(170)).toMatchObject({ activeTotal: 113_039, eliteExp: 2_372, shuraExp: 3_163 })
    expect(getUpgradeLevelData(171)).toMatchObject({ expNeeded: 36_295_458, isEstimated: true })
    expect(UPGRADE_LEVEL_DATA.at(-1)).toMatchObject({ level: 175, expNeeded: null, isEstimated: true })
  })

  it('跨多级累计并扣除本级已有经验', () => {
    expect(totalRemainingExperience(140, 35_498, 141)).toBe(10_000_000)
    expect(totalRemainingExperience(140, 35_498, 142)).toBe(10_000_000 + 11_035_498)
    expect(totalRemainingExperience(150, 123, 150)).toBe(0)
  })
})

describe('逐日升级推演', () => {
  it('关闭超影时始终使用截图中的丰饶基础经验', () => {
    const level150 = getUpgradeLevelData(150)!
    expect(simulateUpgrade({ ...baseConfig, currentLevel: 150, targetLevel: 151, vipLevel: 0 }).firstDay?.bountyExp).toBe(level150.bountyBase)
    expect(simulateUpgrade({ ...baseConfig, currentLevel: 150, targetLevel: 151, vipLevel: 15 }).firstDay?.bountyExp).toBe(level150.bountyBase)
  })

  it('开启超影后按 V 档位使用丰饶倍率', () => {
    const level150 = getUpgradeLevelData(150)!
    expect(simulateUpgrade({ ...baseConfig, currentLevel: 150, targetLevel: 151, vipLevel: 6, superKage: true }).firstDay?.bountyExp).toBe(Math.round(level150.bountyBase * 1.4))
    expect(simulateUpgrade({ ...baseConfig, currentLevel: 150, targetLevel: 151, vipLevel: 10, superKage: true }).firstDay?.bountyExp).toBe(Math.round(level150.bountyBase * 1.5))
    expect(simulateUpgrade({ ...baseConfig, currentLevel: 150, targetLevel: 151, vipLevel: 14, superKage: true }).firstDay?.bountyExp).toBe(Math.round(level150.bountyBase * 1.6))
    expect(level150.bountyV14).toBe(level150.bountyBase * 1.6)
  })

  it('超影不改变精英或修罗副本的经验率，只增加拉面体力', () => {
    const withoutSuper = simulateUpgrade({ ...baseConfig, staminaBodies: 0, superKage: false })
    const withSuper = simulateUpgrade({ ...baseConfig, staminaBodies: 0, superKage: true })
    expect(withoutSuper.baseStamina).toBe(440)
    expect(withSuper.baseStamina).toBe(590)
    expect(withoutSuper.firstDay!.dungeonExp / withoutSuper.firstDay!.eliteRuns).toBe(getUpgradeLevelData(140)!.eliteExp)
    expect(withSuper.firstDay!.dungeonExp / withSuper.firstDay!.eliteRuns).toBe(getUpgradeLevelData(140)!.eliteExp)
  })

  it.each([
    [0, 440, 44, 0, 0],
    [3, 590, 59, 0, 0],
    [6, 740, 74, 0, 0],
    [9, 890, 75, 14, 0],
  ] as const)('每日 %i 体时优先精英再刷修罗', (staminaBodies, stamina, elite, shura, remaining) => {
    const day = simulateUpgrade({ ...baseConfig, staminaBodies }).firstDay
    expect(day).toMatchObject({
      addedStamina: stamina,
      eliteRuns: elite,
      shuraRuns: shura,
      remainingStamina: remaining,
    })
  })

  it('其他每周体力按七日平均计入每日基础体力', () => {
    const result = simulateUpgrade({ ...baseConfig, otherWeeklyStamina: 500 })
    expect(result.baseStamina).toBeCloseTo(590 + 500 / 7)
    expect(result.firstDay?.addedStamina).toBeCloseTo(590 + 500 / 7)
  })

  it('只差一点经验时当天完成', () => {
    const result = simulateUpgrade({ ...baseConfig, currentExp: 10_035_497 })
    expect(result.days).toBe(1)
    expect(result.milestones[0].dateReached).toEqual(new Date(2026, 6, 29, 12))
  })

  it('兼容未提供买体选项的旧配置并默认三体', () => {
    const { staminaBodies: _staminaBodies, otherWeeklyStamina: _otherWeeklyStamina, ...legacy } = baseConfig
    expect(simulateUpgrade(legacy).firstDay?.addedStamina).toBe(590)
  })

  it('当前等级等于目标等级时返回零天', () => {
    const result = simulateUpgrade({ ...baseConfig, targetLevel: 140 })
    expect(result.days).toBe(0)
    expect(result.firstDay).toBeNull()
    expect(result.milestones).toEqual([])
  })

  it('支持 170 升至 175，并在 175 级边界阻止继续升级和非法经验', () => {
    expect(totalRemainingExperience(170, 0, 171)).toBe(35_095_458)
    expect(totalRemainingExperience(170, 0, 175)).toBe(35_095_458 + 36_295_458 + 37_495_458 + 38_695_458 + 39_895_458)
    expect(() => totalRemainingExperience(175, 0, 174)).toThrow('目标等级不能低于')
    expect(() => simulateUpgrade({ ...baseConfig, currentLevel: 175, targetLevel: 175, currentExp: 1 })).toThrow('满级')
  })

  it('拒绝无效日期和越界配置', () => {
    expect(() => simulateUpgrade({ ...baseConfig, startDate: '2026-02-30' })).toThrow('有效的开始计算日期')
    expect(() => simulateUpgrade({ ...baseConfig, currentExp: getUpgradeLevelData(140)?.expNeeded ?? 0 })).toThrow('当前经验应在')
    expect(() => simulateUpgrade({ ...baseConfig, otherWeeklyStamina: -1 })).toThrow('其他每周体力')
  })

  it('超过逐日推演安全上限时停止计算', () => {
    expect(() => simulateUpgrade(baseConfig, 0)).toThrow('20,000 天安全上限')
  })
})
