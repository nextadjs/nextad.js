export * from "./interface";
export * from "./config";
export * from './user-config';
export * from './options';

export interface Price {
  value: number;
  model: PriceModel;
}

// cpc, cpa, flat...
export type PriceModel = "cpm";
