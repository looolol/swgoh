export type DatacronSet = {
    id: number;
    display_name: string;
    expiration_time: string;
    icon: string;
    icon_empty: string;
    icon_maxed: string;
    url: string;
    max_tier_id: number;
    tiers: {
        tier_id: number;
        scope_identifier: number;
    } [];
}