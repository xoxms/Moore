export type Inventory = Array<{ id: number; quantity: number }>;
export type FullInventory = Array<Item & { quantity: number }>;

export type User = {
  userId: string;
  coin: number;
  xp: number;
  level: number;
  inventory: Inventory;
  jobs: string;
  timeout: {
    daily: number;
    weekly: number;
    jobsChange: number;
    work: number;
  };
};

export type Item = {
  id: number;
  name: string;
  emoji: string;
  description: string;
  type: string;
  rarity: string;
  packed: object;
  sellable: boolean;
  price: number;
};

export type Job = {
  name: string;
  description: string;
  income: number;
  minimumLevel: number;
  cooldown: number;
};
