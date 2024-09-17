// Response types returned from the character and unit endpoints
// They represent the character's data from the database

// Main difference is that UnitGameData includes additional fields like
// ship_base_id, ship_slot, activate_shard_count, is_capital_ship, is_galactic_legend, 
// made_available_on, crew_base_id, omicron_ability_ids, and zeta_ability_ids



export type Character = {
    name: string;
    base_id: string;
    url: string;
    image: string;
    power: number;
    description: string;
    combat_type: number;
    gear_levels: {
        tier: number;
        gear: string[];
    } [];
    alignment: string;
    categories: string[];
    ability_classes: string[];
    role: string;
    ship: string;
    ship_slot: number | null;
    activate_shard_count: number;
}

export type UnitGameData= {
    name: string;
    base_id: string;
    url: string;
    image: string;
    power: number;
    description: string;
    combat_type: number;
    gear_levels: {
        tier: number;
        gear: string[];
    } [];
    alignment: string;
    categories: string[];
    ability_classes: string[];
    role: string;
    ship_base_id: string | null;
    ship_slot: number | null;
    activate_shard_count: number;
    is_capital_ship: boolean;
    is_galactic_legend: boolean;
    made_available_on: string;
    crew_base_id: string[];
    omicron_ability_ids: string[];
    zeta_ability_ids: string[];
}