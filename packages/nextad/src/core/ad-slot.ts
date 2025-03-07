import type { Ad } from "./ads/ad";

export class AdSlot {
  public readonly element: HTMLDivElement;
  public readonly ad: Ad;

  public constructor(element: HTMLDivElement, ad: Ad) {
    this.element = element;
    this.ad = ad;
  }
}
