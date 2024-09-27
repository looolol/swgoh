import { Category, Team, Unit } from "./team.model";

export enum TeamUpdateType {
    Add,
    Remove,
    Move,
    Rename
}

export enum UnitUpdateType {
    Add,
    Remove,
    Move,
}

export interface TeamUpdateEvent {
    type: TeamUpdateType;
    category: Category;
    team: Team;
    unit?: Unit;
    newName?: string;
    newIndex?: number;
}

export interface UnitUpdateEvent {
    type: UnitUpdateType;
    categoryId: string;
    teamId: string;
    unitId: string;
    newIndex?: number;
}