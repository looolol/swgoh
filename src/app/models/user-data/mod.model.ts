export type Mod = {
    id: string;
    level: number;
    tier: number;
    rarity: number;
    set: string;
    slot: number;
    primary_stat: {
        name: string;
        stat_id: number;
        value: number;
        display_value: string;
    };
    character: string;
    secondary_stats: {
        name: string;
        stat_id: number;
        value: number;
        display_value: string;
        roll: number;
        unscaled_roll_values: number[];
        stat_max: number;
        stat_min: number;
        stat_rolls: number[];
    }[];
    reroll_count: number;
}