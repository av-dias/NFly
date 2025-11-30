export interface Airport {
  airportId: number;
  ident: string;
  name: string;
  city: string | null;
  type: string | null;
  hasAvGas: boolean;
  hasJetFuel: boolean;
  hasTower: boolean;
  towerFrequency: string | null;
  atisFrequency: string | null;
  isClosed: boolean;
  isMilitary: boolean;
  nrRunwayHard: number;
  nrRunwaySoft: number;
  nrRunwayLight: number;
  nrOfRunways: number;
  longestRunwayWidth: number;
  longestRunwayLength: number;
  longestRunwayHeading: number;
  longestRunwaySurface: string | null;
  rating: number | null;
  altitude: number;
  longitude: number;
  latitude: number;
}
