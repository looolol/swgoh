import { Unit } from "./user-data/unit.model";

export interface Team {
    name: string;
    units: Unit[];
  }
  
  export interface Category {
    name: string;
    teams: Team[];
  }
  