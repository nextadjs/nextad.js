import { uuid } from "@/utils";
import type {
  AdCOMPlacement,
  Buyer,
  ClientSignal,
  Compliance,
  Context,
  ServerSignal,
} from "@nextad/registry";

export class AdSpot {
  public readonly id: string;

  public constructor(
    public readonly placement: AdCOMPlacement,
    public readonly context: Context,
    public readonly buyers: Buyer<any>[],
    public readonly signals:
      | ClientSignal<unknown, any>[]
      | ServerSignal<unknown, any>[],
    public readonly compliances: Compliance<any>[]
  ) {
    this.id = uuid();
  }
}
