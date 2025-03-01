import type { Runtime } from "@nextad/registry";
import { isServer } from "./validate";
import { deepCopy as rfdc } from "@/libraries/rfdc";
import { v4 } from "@/libraries/uuid";

export const getRuntime = (): Runtime => {
  return isServer() ? "server" : "client";
};

export const deepCopy = rfdc;

export const uuid = v4;
