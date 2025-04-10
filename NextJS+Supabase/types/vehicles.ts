import { Tables } from './database.types';

export type TVehicle = Tables<'vehicles'>;

export interface VehicleMake {
  Make_Name: string;
}

export interface VehicleModel {
  Model_Name: string;
}

export interface VinDecodingResult {
  Variable: string;
  Value: string | null;
}

export interface VinDetails {
  make: string;
  model: string;
  year: string;
  vehicleType: string;
}

export interface MakesResponse {
  makes: string[];
}

export interface ModelsResponse {
  make: string | null;
  year: string | null;
  models: string[];
}

export interface VinResponse {
  vin: string;
  make: string;
  model: string;
  year: string;
  vehicleType: string;
}

export interface NHTSAMakesResponse {
  Results: VehicleMake[];
}

export interface NHTSAModelsResponse {
  Results: VehicleModel[];
}

export interface NHTSAVinResponse {
  Results: VinDecodingResult[];
}
