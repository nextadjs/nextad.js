export interface Config {
  targeting?: {
    providers?: Record<
      string,
      {
        params: Record<string, unknown>;
      }
    >;
  };
  optimization?: {
    providers?: Record<
      string,
      {
        params: Record<string, unknown>;
      }
    >;
  };
  trade?: {
    providers?: Record<
      string,
      {
        params: Record<string, unknown>;
      }
    >;
  };
}
