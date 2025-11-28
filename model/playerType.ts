export type Player = {
  id: number;
  name: string;
  icao: string;
  totalFlyTime: number;
  xp: number;
  cash: number;
  rank: number;
  currentPlane: number;
  reputation: number;
  usablePayload?: number;
  freePayload?: number;
  maxDistance?: number;
  fuelPercentage?: number;
  maxSpeed?: number;
};
