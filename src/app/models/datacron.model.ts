import { IUserData, UserDataType } from "./unit-service.model";


export interface Datacrons extends IUserData {
    timestamp: number;
    userDataType: UserDataType.DATACRONS;
    data: Datacron[];
}

export type Datacron = {
    id: string,
    set_id: number,
    template_base_id: string,
    reroll_count: number,
    reroll_index: number,
    locked: boolean,
    tier: number,
    tiers: {
        scope_identifier: number,
        scope_icon: string,
        scope_target_name: string,
        target_rule_id: string | null,
        ability_id: string | null,
        stat_type: number,
        stat_value: number,
        required_unit_tier: number,
        required_relic_tier: number,
        ability_description: string | null
    } [],
    url: string
}