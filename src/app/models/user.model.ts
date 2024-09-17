import { Character } from "./character.model";


export type User = {
    allyCode: string;
    userName: string;
}

export const DEFAULT_USER: User = {
    allyCode: '',
    userName: '',
};


export type UserData = {
    timestamp: number;
    characters: Character[];
}

export const DEFAULT_USER_DATA: UserData = {
    timestamp: 0,
    characters: []
};