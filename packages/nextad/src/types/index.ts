export * from "./interface";
export * from "./config";

export interface Price {
  value: number;
  model: PriceModel;
}

// cpc, cpa, flat...
export type PriceModel = "cpm";
