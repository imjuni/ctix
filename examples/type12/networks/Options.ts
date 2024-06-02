import { NetworkConfig } from './NetworkConfig';

interface Options {
  stackName: string;
  config: NetworkConfig;
}

interface IEndpoint {
  name: string;
  hostname: string;
  port: number;
}

interface ICommand {
  kind: string;
  buffer: Buffer;
}

export interface IProtocol {
  name: string;
}

export type { ICommand };

export type { IEndpoint, Options as StackNetworkOptions };
