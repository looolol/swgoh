export interface ConquestFeat {
  description: string,
  keycards: number,
  required: number,
  progress: number,
  completed: boolean,
  skip: boolean
}

export interface ConquestSector {
  name: string,
  feats: ConquestFeat[],
  miniBossNode: ConquestFeat[],
  bossNode: ConquestFeat[],
  keycardProgress: number,
  total: number
}

export interface ConquestStore {
  global: ConquestSector,
  sectorOne: ConquestSector,
  sectorTwo: ConquestSector,
  sectorThree: ConquestSector,
  sectorFour: ConquestSector,
  sectorFive: ConquestSector,
  keycardProgress: number,
  total: ConquestCrate,
}

export enum ConquestCrate {
  REWARD_CRATE_1 = 100,
  REWARD_CREATE_2 = 165,
  REWARD_CRATE_3 = 230,
  REWARD_CRATE_4 = 365,
  REWARD_CRATE_5 = 450,
  REWARD_CRATE_6 = 530,
  REWARD_CRATE_7 = 630,
  FIRST_CRATE = REWARD_CRATE_1,
  GOLD_CRATE = REWARD_CRATE_6,
  RED_CRATE = REWARD_CRATE_7,
}

export function createNewFeat(description: string, points: number, required: number = 1): ConquestFeat {
  return {
    description: description,
    keycards: points,
    required: required,
    progress: 0,
    completed: false,
    skip: false,
  }
}
