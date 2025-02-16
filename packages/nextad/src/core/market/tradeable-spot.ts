import type { AdSpot } from "../opportunity/ad-spot";
import type { TradeableBuyer } from "@/types";

export class TradeableSpot {
  public constructor(
    private readonly _adSpot: AdSpot,
    private readonly _tradeableBuyers: TradeableBuyer[]
  ) {}

  public get adSpot() {
    return this._adSpot;
  }

  public get tradeableBuyers() {
    return this._tradeableBuyers;
  }
}
