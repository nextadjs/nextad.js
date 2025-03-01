import { AdSpot } from "@/core/ad-spot";
import type { IAdOpportunityController, IConfig } from "@/types";
import { deepCopy, getRuntime } from "@/utils";
import { allSettledWithTimeout } from "@/utils/promise";
import type { AdCOMPlacement } from "@nextad/registry";
export class AdOpportunityController implements IAdOpportunityController {
  constructor(private readonly config: IConfig) {}

  public async evaluate(placements: AdCOMPlacement[]): Promise<AdSpot[]> {
    // コンテキストを生成
    // コンテキストはインターフェース側で充実させるのが現実的
    let context = this.config.getContext();

    // コンテキストのみの共通評価だけ行う
    const signals = await this.config.getSignals(getRuntime(), context);
    // 一度シグナルのデータを初期化する
    allSettledWithTimeout(
      signals.map(async (signal) => {
        await signal.initialize();
      }),
      3000
    ); //タイムアウトは要調整

    for (let signal of signals) {
      const signalContextHandler = signal.handleContext();
      if (context.channel === "site") {
        // これ渡すときにrfdc使ってディープコピーしたのを渡してあげる
        context.source.site = await signalContextHandler.decorateSite(
          deepCopy(context.source.site)
        );
      } else if (context.channel === "app") {
        // TODO: dooh, app
      }

      // user, regs, device...etc
    }

    const compliances = await this.config.getCompliances(getRuntime(), context);
    // とりえあず順番処理する
    for (let compliance of compliances) {
      const complianceContextHandler = compliance.handleContext();
      if (context.channel === "site") {
        context.source.site = await complianceContextHandler.validateSite(
          deepCopy(context.source.site)
        );
      }
    }  

    const buyers = await this.config.getBuyers(getRuntime(), context);

    const adSpots = placements.map(
      (placement) =>
        new AdSpot(placement, context, buyers, signals, compliances)
    );

    return adSpots;
  }
}
