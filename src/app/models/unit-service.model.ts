export enum UserDataType {
    UNITS = 'units',
    MODS = 'mods',
    DATACRONS = 'datacrons'
  }
  
  export interface IUserData {
    timestamp: number;
    userDataType: UserDataType;
    data: any[];
  }
  
  export type UserData = {
    [key in UserDataType]: IUserData;
  }