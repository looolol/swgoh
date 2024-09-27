import { Character } from "./game-data/character.model";
import { UserUnitData } from "./user-data/unit-user-data.model";

export interface TeamPlannerState {
  categories: Category[];
  units: Unit[];
  isUnique: boolean;
}

export interface Category {
  id: string;
  name: string;
  teams: Team[];
}

export interface Team {
  id: string;
  name: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  assigned: boolean;
  userUnitData: UserUnitData;
  characterDefinition: Character;
}