export type Player = 'blue' | 'orange';
export type Theme = 'code' | 'gaming';
export type BoardSize = 16 | 24 | 36;

export interface MemoryCard {
  id: number;
  image: string;
  pairId: number;
  matched: boolean;
}
