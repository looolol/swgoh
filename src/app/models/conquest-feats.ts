import {ConquestSector, ConquestStore, ConquestCrate, createNewFeat} from "./conquest.model";


export const global: ConquestSector = {
  name: "Global",
  feats: [
    createNewFeat("Defeat at least 250 enemies on the golden Challenge Path", 15, 250),
    createNewFeat("Win 15 battles with Master Qui-Gon surviving", 1, 15),
    createNewFeat("Attempt to inflict Stagger 100 times", 15, 100),
    createNewFeat("Win 15 battles with at least 5 Gungans", 1, 15),
    createNewFeat("Win at least 20 battles with a full squad of Nightsisters", 15, 20),
    createNewFeat("Win 20 battles with a full squad of Imperial Remnants", 15, 20),
    createNewFeat("Gain Massively Overpowered 20 times", 15, 20),
    createNewFeat("Complete a battle with Deployable Cooling Systems", 15),
  ],
  bossNode: [],
  miniBossNode: [],
  keycardProgress: 0,
  total: 92
}

export const sectorOne: ConquestSector = {
  name: "Sector 1",
  feats: [
    createNewFeat("Attempt to inflict Tenacity Down 50 times", 5, 50),
    createNewFeat("Defeat 35 enemies with Gungan units", 5, 35),
    createNewFeat("Win 10 Battles with Morgan Elsbeth surviving", 5, 10),
    createNewFeat("Gain Decay 50 times", 5, 50),
  ],
  miniBossNode: [
    createNewFeat("Win with a full squad of Geonosians", 2),
    createNewFeat("Win with only Light Side characters", 2),
  ],
  bossNode: [
    createNewFeat("Defeat an enemy with Queen Amidala", 3),
    createNewFeat("Win with Gungan Boomadier surviving", 3),
  ],
  keycardProgress: 0,
  total: 96
}

export const sectorTwo: ConquestSector = {
  name: "Sector 2",
  feats: [
    createNewFeat("Gain bonus turn 50 times", 5, 50),
    createNewFeat("Attempt to inflict Breach 50 times", 5, 50),
    createNewFeat("Defeat 35 enemies with Morgan Elsbeth", 5, 35),
    createNewFeat("Gain Alert 20 times", 5, 20),
  ],
  miniBossNode: [
    createNewFeat("Win with Death Trooper (Peridea) surviving", 2),
    createNewFeat("Win with Master Qui-Gon and Qui-Gon Jinn in your squad", 2),
  ],
  bossNode: [
    createNewFeat("Win with only Dark Side characters", 3),
    createNewFeat("Defeat an enemy with Captain Tarpals", 3),
  ],
  keycardProgress: 0,
  total: 96
}

export const sectorThree: ConquestSector = {
  name: "Sector 3",
  feats: [
    createNewFeat("Win 15 battles with a full squad of Geonosians", 10, 15),
    createNewFeat("Gain Evasion Up 50 times", 10, 50),
    createNewFeat("Win 15 battles with Nightsister Acolyte Surviving", 10, 15),
    createNewFeat("Gain retaliate 15 times", 10, 15),
  ],
  miniBossNode: [
    createNewFeat("Win with Morgan Elsbeth surviving", 2),
    createNewFeat("Win with Captain Enoch surviving", 2),
  ],
  bossNode: [
    createNewFeat("Win with Queen Amidala surviving", 3),
    createNewFeat("Win without using any Support units in your squad", 3),
  ],
  keycardProgress: 0,
  total: 118
}

export const sectorFour: ConquestSector = {
  name: "Sector 4",
  feats: [
    createNewFeat("Attempt to inflict or gain Blight 40 times", 10, 40),
    createNewFeat("Defeat 30 enemies with Nightsister units", 10, 30),
    createNewFeat("Win 15 battles with Kelleran Beq in your squad", 10, 15),
    createNewFeat("Gain Tenacity Up 50 times", 10, 50),
  ],
  miniBossNode: [
    createNewFeat("Win with a full squad of Galactic Republic surviving", 3),
    createNewFeat("Win with Jar Jar surviving", 3),
  ],
  bossNode: [
    createNewFeat("Win without using any Empire in your squad", 4),
    createNewFeat("Win with Dark Trooper Moff Gideon surviving", 4),
  ],
  keycardProgress: 0,
  total: 120,
}

export const sectorFive: ConquestSector = {
  name: "Sector 5",
  feats: [
    createNewFeat("Win 15 battles with Geonosian Spy surviving", 15, 15),
    createNewFeat("Attempt to inflict Plague 100 times", 15, 100),
    createNewFeat("Defeat 25 enemies with Death Trooper (Peridea)", 15, 25),
    createNewFeat("Gain Accuracy Up 50 times", 15, 50),
  ],
  miniBossNode: [
    createNewFeat("Defeat an enemy with Padawan Obi-Wan", 3),
    createNewFeat("Win without using any Galactic Republic in your squad", 3),
  ],
  bossNode: [
    createNewFeat("Win with Luthen Rael surviving", 5),
    createNewFeat("Win with a full squad of Gungans", 5),
  ],
  keycardProgress: 0,
  total: 142
}


export const allConquestSectors: ConquestStore = {
  global,
  sectorOne,
  sectorTwo,
  sectorThree,
  sectorFour,
  sectorFive,
  keycardProgress: 0,
  total: ConquestCrate.RED_CRATE
};
