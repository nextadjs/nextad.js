import type { AdCOMAd, Runtime } from "@nextad/registry";
import type { AdSpot } from "./ad-spot";

export abstract class Ad {
  public abstract readonly runtime: Runtime;
  protected readonly adSpot: AdSpot;
  protected readonly creative: AdCOMAd;

  public constructor(adSpot: AdSpot, creative: AdCOMAd) {
    this.adSpot = adSpot;
    this.creative = creative;
  }
}
