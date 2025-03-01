import type { Ad } from "@/core/ads/ad";
import type { AdSpot } from "@/core/ad-spot";
import type { AdExchangeStrategy } from "@/core/ad-exchange-strategies";
import type { AdCOMPlacement } from "@nextad/registry";

export interface IAdTradeController {
  execute(placements: AdCOMPlacement[]): Promise<Ad>;
}

export interface IAdOpportunityController {
  evaluate(placements: AdCOMPlacement[]): Promise<AdSpot[]>;
}

export interface IAdExchangeController {
  execute(adSpots: AdSpot[], adExchangeStrategy: AdExchangeStrategy): Promise<Ad[]>;
}

export interface IAdDeliveryController {
  serve(adSlot: HTMLDivElement, ad: Ad): Promise<void>; // 広告配信を操作するための何らかのオブジェクト返したい Adでもあり？ refreshとかもろもろ
  // どちらかというとこっちにrefreshとか配信関係の操作用意するのがよさそうではある
  // でもそれだとdisplayとかのメソッドのほうがserveより適切なように思える
  // より抽象的な概念をserveで表現して、設定関係でrefreshとかはやってもらうか
  // それともこっちでインターフェースパッケージに操作を任せるか
  // まぁ設定を柱としたserveがいいだろうな
  // ただrefreshとかもある程度柔軟性は必要だと思う。そういうのをどうするかはやっぱり問題
}
