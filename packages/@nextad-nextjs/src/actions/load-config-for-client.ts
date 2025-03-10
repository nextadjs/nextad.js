"use server";

import { loadConfig } from "@/config";
import type { UserConfig as Config } from "nextad";

export async function loadConfigForClient(): Promise<Config> {
  // TODO: サニタイズ処理
  return await loadConfig();
}
