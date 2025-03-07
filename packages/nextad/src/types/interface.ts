import type { Ad } from "@/core/ads/ad";
import type { AdSpot } from "@/core/ad-spot";
import type { AdExchangeStrategy } from "@/core/ad-exchange-strategies";
import type { AdCOMPlacement } from "@nextad/registry";
import type { AdSlot } from "@/core/ad-slot";

export interface IAdTradeController {
  execute(placements: AdCOMPlacement[]): Promise<Ad>;
}

export interface IAdOpportunityController {
  evaluate(placements: AdCOMPlacement[]): Promise<AdSpot[]>;
}

export interface IAdExchangeController {
  execute(
    adSpots: AdSpot[],
    adExchangeStrategy: AdExchangeStrategy
  ): Promise<Ad[]>;
}

export interface IAdMatchingController {
  match(ads: Ad[]): Promise<Ad>;
}

export interface IAdDeliveryController {
  serve(targetElement: HTMLDivElement, ad: Ad): Promise<void>;
}

export interface IAdRenderingController {
  render(adSlot: AdSlot): Promise<void>;
}
