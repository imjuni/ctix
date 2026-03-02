export interface DummyConfig {
  baseUrl: string;
  token: string;
}

export const defaultDummyConfig: DummyConfig = {
  baseUrl: "https://example.com",
  token: "token1234",
};
