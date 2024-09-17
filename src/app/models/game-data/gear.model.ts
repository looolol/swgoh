export type Gear = {
    base_id: string;
    recipes: {
        base_id: string;
        result_id: string;
        const: number;
        ingredients: {
            amount: number;
            gear: string;
        } [];
    } [];
    tier: number;
    required_level: number;
    stats: Record<string, number | null>[];
    mark: string;
    cost: number;
    image: string;
    url: string;
    ingredients: {
        amount: number;
        gear: string;
    } [];
    name: string;
}