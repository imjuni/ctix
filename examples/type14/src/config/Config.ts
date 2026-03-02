export interface Config {
  baseUrl: string;
  token: string;
}

export const defaultConfig: Config = {
  baseUrl: 'https://example.com',
  token: 'token1234',
};
