export type ItemCategory = "chassis" | "paint" | "tracer";

export interface MarketItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  color: string;
  glowColor: string;
  rarity: "COMMON" | "RARE" | "LEGENDARY";
  description: string;
}
