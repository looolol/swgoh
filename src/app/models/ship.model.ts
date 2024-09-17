export type Ship = {
    name: string;
    base_id: string;
    url: string;
    image: string;
    power: number;
    description: string;
    combat_type: number;
    alignment: string;
    categories: string[];
    ability_classes: string[];
    role: string;
    capital_ship: true;
    activate_shard_count: number;
}