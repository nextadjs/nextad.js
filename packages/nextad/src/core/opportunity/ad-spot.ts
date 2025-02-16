import type { Context } from "iab-adcom/context";
import type { Placement } from "iab-adcom/placement";
import type { AdSpotEvaluation } from "./ad-spot-evaluation";

export class AdSpot {
  private readonly _placement: Placement;
  private readonly _context: Context;
  private _evaluation: AdSpotEvaluation;

  public constructor(
    placement: Placement,
    context: Context,
    evaluation: AdSpotEvaluation
  ) {
    this._placement = placement;
    this._context = context;
    this._evaluation = evaluation;
  }

  public get context(): Context {
    return this._context;
  }

  public get placement(): Placement {
    return this._placement;
  }

  public getOpenRTBEvaluation() {
    return this._evaluation.openrtb;
  }
}
