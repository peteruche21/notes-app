import "iron-session";
import type { JWKInterface } from "arweave/node/lib/wallet";
import type { SiweMessage } from "siwe";
import type Wallet from "ethereumjs-wallet";

interface SDKOptions {
  name?: "weavedb" | string;
  version?: "1" | string;
  wallet?: JWKInterface | string;
  contractTxId: string;
  rpc?: string;
  EthWallet?: Wallet;
  arweave_wallet?: JWKInterface;
  network?: "localhost" | "testnet" | "mainnet";
  port?: 1820 | number;
  secure?: boolean;
  cert?: string | undefined;
}

interface SDKFPOptions {
  [key: string]: string | object | ArrayLike;
}

interface WeaveDBIdentity {
  privateKey: string;
  linked_address?: string;
  address: string;
  publicKey: string;
}

interface WeaveDBSignerObject {
  wallet: string;
  identity: WeaveDBIdentity;
  tx?: object;
  err?: unknown;
}

interface WeaveDBResponseObject<T> {
  block: { height: number; timestamp: number };
  data: T;
  id: string;
  setter: string;
}

class SDK {
  static instance: SDK;
  constructor(opts: SDKOptions);
  initialize(opts: SDKOptions): void;
  initializeWithoutWallet(): Promise<void>;
  setSchema<T>(schema: T, name: string, opts?: SDKFPOptions): Promise<void>;
  setRules<T>(rules: T, name: string, opts?: SDKFPOptions): Promise<void>;
  createTempAddress(address: string): Promise<WeaveDBSignerObject>;
  ts(): number;
  signer(): string;
  getInfo(): Promise<void>;
  get<Schema>(
    collection: string,
    docid?: string,
    ...opts
  ): Promise<WeaveDBResponseObject<Schema>[]>;
  cget<Schema>(
    collection: string,
    ...opts
  ): Promise<WeaveDBResponseObject<Schema>[]>;
  add<T>(
    data: T,
    collection: string,
    signingOpts?: { wallet?: string; privateKey?: string },
    ...opts
  ): Promise<void>;
  update<T>(
    newData: T,
    collection: string,
    docid: string,
    signingOpts?: { wallet?: string; privateKey?: string },
    ...opts
  ): Promise<void>;
  delete(
    collection: string,
    docid: string,
    signingOpts?: { wallet?: string; privateKey?: string },
    ...opts
  ): Promise<void>;
}

declare type WeaveDBInstance = typeof SDK.instance;
declare type WeaveDB = typeof SDK;

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
    issuedAt?: string;
    expirationTime?: string;
    siwe?: SiweMessage;
    weavedbUser?: WeaveDBSignerObject;
  }
}
