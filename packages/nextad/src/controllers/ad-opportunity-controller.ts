import { AdSpot } from "@/core/opportunity/ad-spot";
import type { Config, Options } from "@/types";
import type { AdCOMContext, AdCOMPlacement } from "@nextad/registry";
import { AdSpotFactory } from "@/core/opportunity/ad-spot-factory";

export class AdOpportunityController {
  constructor(private readonly config: Config) {}

  public async evaluate(
    placement: AdCOMPlacement,
    context: AdCOMContext,
    options?: Options
  ): Promise<AdSpot> {
    /*
    const signalConfig = {
      ...this.config?.targeting?.providers,
      ...this.config?.optimization?.providers,
    };

    // TODO* 本当はシグナル側の設定を読み込んで含ませるの判断をやる

    const signalSettledResult = await Promise.allSettled(
      Object.keys(signalConfig).map(async (name) => {
        const signal = await signalRegistry.load(
          name,
          isServer() ? "server" : "client"
        );
        await signal.initialize();
        return signal;
      })
    );

    const signals = getSuccessfulResults<Signal>(signalSettledResult);
    */

    return new AdSpotFactory().create(placement, context, options);
  }
}
