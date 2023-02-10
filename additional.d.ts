import "iron-session";
import type { JWKInterface } from "arweave/node/lib/wallet";
import type { SiweMessage } from "siwe";
import type Wallet from "ethereumjs-wallet";

interface SDKOptions {
  wallet?: JWKInterface;
  contractTxId?: string;
  EthWallet?: Wallet;
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
  tx: object;
  err?: unknown;
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
  get(
    collection: string,
    docid?: string,
    ...opts
  ): Promise<Record<object | ArrayLike, never>>;
  cget(collection: string, ...opts): Promise<Record<object | ArrayLike, never>>;
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
