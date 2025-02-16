import { isServer } from "./validate";

export const getContext = () => {
  return isServer() ? "server" : "client";
};
