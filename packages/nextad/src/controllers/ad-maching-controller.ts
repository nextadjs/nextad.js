import type { Ad } from "@/core/ads/ad";
import type { IAdMatchingController } from "@/types";

export class AdMatchingController implements IAdMatchingController {
    public async match(ads: Ad[]): Promise<Ad> {
        // マッチング処理
        return ads[0]!;
    }
}