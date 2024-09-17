export type Ability = {
    base_id: string;
    ability_id: string;
    name: string;
    image: string;
    url: string;
    tier_max: number;
    is_zeta: boolean;
    is_omega: boolean;
    is_omicron: boolean;
    is_ultimate: boolean;
    description: string;
    combat_type: number;
    omicron_mode: number;
    type: number;
    character_base_id: string;
    ship_base_id: string;
    omicron_battle_types: string[];
}