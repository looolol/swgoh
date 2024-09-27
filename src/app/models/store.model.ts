import { Ability } from "./game-data/ability.model";
import { Character } from "./game-data/character.model";
import { DatacronSet } from "./game-data/datacron-sets.model";
import { Datacron } from "./user-data/datacron.model";
import { Gear } from "./game-data/gear.model";
import { Mod } from "./user-data/mod.model";
import { Ship } from "./game-data/ship.model";
import { Stat } from "./game-data/stat.model";
import { UserUnitData } from "./user-data/unit-user-data.model";
import { User } from "./user-data/user.model";

export type UserDataStore = {
  user: User;
  units: UserUnitData[];
  mods: Mod[];
  datacrons: Datacron[];
}

export type GameDataStore = {
  characters: Character[];
  ships: Ship[];
  gear: Gear[];
  abilities: Ability[];
  datacronSets: DatacronSet[];
  statDefinitions: Stat[];
}

export const InitUserDataStore: UserDataStore = {
  user: {} as User,
  units: [],
  mods: [],
  datacrons: [],
}

export const InitGameDataStore: GameDataStore = {
  characters: [],
  ships: [],
  gear: [],
  abilities: [],
  datacronSets: [],
  statDefinitions: [],
}