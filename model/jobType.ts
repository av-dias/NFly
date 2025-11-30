import { Airport } from "./airportType";

export type Job = {
  id: number;
  departure: string;
  latDep: number;
  lonDep: number;
  arrival: string;
  latArriv: number;
  lonArriv: number;
  dist: number;
  missionType: number;
  pax: number;
  weight: number;
  goodId: number;
  reward: number;
  missionHeading: number;
  nameAirport: string;
  available: number;
  expiration: number;
  allowedTime: number;
  rank: number;
  liveID: string;
  xp: number;
  stackable: number;
  source: number;
  aircraftType: number;
  airport?: Airport;
};
