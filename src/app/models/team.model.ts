import { UserUnitData } from "./user-data/unit-user-data.model";

export interface TeamPlannerState {
  categories: Category[];
  allUnits: Unit[];
  unassignedUnits: Unit[];
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
  userUnitData: UserUnitData;
}