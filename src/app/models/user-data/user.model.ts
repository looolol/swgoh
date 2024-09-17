export type User = {    
    ally_code: number;
    arena_leader_base_id: string;
    arena_rank: number;
    level: number;
    name: string;
    last_updated: string;
    galactic_power: number;
    character_galactic_power: number;
    ship_galactic_power: number;
    ship_battles_won: number;
    pvp_battles_won: number;
    pve_battles_won: number;
    galactic_war_won: number;
    guild_raid_won: number;
    guild_contribution: number;
    guild_exchange_donations: number;
    season_full_clears: number;
    season_successful_defends: number;
    season_league_score: number;
    season_undersized_squad_wins: number;
    season_promotions_earned: number;
    season_banners_earned: number;
    season_offensive_battles_won: number;
    season_territories_defeated: number;
    url: string;
    arena: {
        rank: number;
        leader: string;
        members: string[];
    };
    fleet_arena: {
        rank: number;
        leader: string;
        members: string[];
        reinforcements: string[];
    };
    skill_rating: number;
    league_name: string;
    league_frame_image: string;
    league_blank_image: string;
    league_image: string;
    division_number: number;
    division_image: string;
    portrait_image: string;
    title: string;
    guild_id: string;
    guild_name: string;
    guild_url: string;
    mods: any[];
}

export const DEFAULT_USER: User = {
    ally_code: 0,
    arena_leader_base_id: '',
    arena_rank: 0,
    level: 1,
    name: '',
    last_updated: new Date().toISOString(),
    galactic_power: 0,
    character_galactic_power: 0,
    ship_galactic_power: 0,
    ship_battles_won: 0,
    pvp_battles_won: 0,
    pve_battles_won: 0,
    galactic_war_won: 0,
    guild_raid_won: 0,
    guild_contribution: 0,
    guild_exchange_donations: 0,
    season_full_clears: 0,
    season_successful_defends: 0,
    season_league_score: 0,
    season_undersized_squad_wins: 0,
    season_promotions_earned: 0,
    season_banners_earned: 0,
    season_offensive_battles_won: 0,
    season_territories_defeated: 0,
    url: '',
    arena: {
        rank: 0,
        leader: '',
        members: [],
    },
    fleet_arena: {
        rank: 0,
        leader: '',
        members: [],
        reinforcements: []
    },
    skill_rating: 0,
    league_name: '',
    league_frame_image: '',
    league_blank_image: '',
    league_image: '',
    division_number: 0,
    division_image: '',
    portrait_image: '',
    title: '',
    guild_id: '',
    guild_name: '',
    guild_url: '',
    mods: []
};