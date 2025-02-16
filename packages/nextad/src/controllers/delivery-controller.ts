import type { Ad, Config } from "@/types";
import { renderer } from "@nextad/renderer";

export class DeliveryController {
  constructor(private readonly config: Config) {}

  public async serve(targetElement: HTMLDivElement, ad: Ad): Promise<void> {
    renderer.render(targetElement, ad);
  }
}
