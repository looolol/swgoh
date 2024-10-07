export type UserUnitData = {
    data: {
        base_id: string;
        name: string;
        gear_level: number;
        level: number;
        power: number;
        rarity: number;
        gear: {
            slot: number;
            is_obtained: boolean;
            base_id: string;
        }[];
        url: string;
        stats: Record<string, number | null>[];
        stat_diff: Record<string, number>[];
        zeta_abilities: string[];
        omicron_abilities: string[];
        ability_data: {
            id: string;
            ability_tier: string;
            is_omega: boolean;
            is_zeta: boolean;
            is_omicron: boolean;
            has_omicron_learned: boolean;
            has_zeta_learned: boolean;
            name: string;
            tier_max: number;
        }[];
        mod_set_ids: string[];
        combat_type: number;
        relic_tier: number;
        has_ultimate: boolean;
        is_galactic_legend: boolean;
    }
} 