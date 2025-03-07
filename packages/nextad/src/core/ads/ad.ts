import type { AdCOMAd, TradeMethod } from "@nextad/registry";
import type { AdSpot } from "../ad-spot";
import type { Price, PriceModel } from "@/types";

export abstract class Ad {
  public abstract readonly tradeMethod: TradeMethod;
  protected readonly adSpot: AdSpot;
  public readonly creative: AdCOMAd;
  public price: Price;

  public constructor(adSpot: AdSpot, creative: AdCOMAd, price: Price) {
    this.adSpot = adSpot;
    this.creative = creative;
    this.price = price;
  }
}
