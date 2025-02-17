import type { AdSpotEvaluation } from "./ad-spot-evaluation";
import type { AdCOMContext, AdCOMPlacement } from "@nextad/registry";

export class AdSpot {
  private readonly _placement: AdCOMPlacement;
  private readonly _context: AdCOMContext;
  private _evaluation: AdSpotEvaluation;

  public constructor(
    placement: AdCOMPlacement,
    context: AdCOMContext,
    evaluation: AdSpotEvaluation
  ) {
    this._placement = placement;
    this._context = context;
    this._evaluation = evaluation;
  }

  public get context(): AdCOMContext {
    return this._context;
  }

  public get placement(): AdCOMPlacement {
    return this._placement;
  }

  public getOpenRTBEvaluation() {
    return this._evaluation.openrtb;
  }
}
