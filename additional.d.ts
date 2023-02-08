import "iron-session";
import type { JWKInterface } from "arweave/node/lib/wallet";
import type { SiweMessage } from "siwe";

interface SDKOptions {
  wallet?: JWKInterface;
  contractTxId?: string;
}

interface SDKFPOptions {
  [key: string]: string | object | ArrayLike;
}

interface WeaveDBUserIdentity {
  privateKey: string;
  linked_address: string;
  tx: string;
  address: string;
}

interface WeaveDBUserObject {
  wallet: string;
  identity: WeaveDBUserIdentity;
}

class SDK {
  static instance: SDK;
  constructor(opts: SDKOptions);
  initialize(opts: SDKOptions): void;
  initializeWithoutWallet(): Promise<void>;
  setSchema(schema: object, name: string, opts?: SDKFPOptions): Promise<void>;
  setRules(rules: object, name: string, opts?: SDKFPOptions): Promise<void>;
  createTempAddress(
    address: string
  ): Promise<{ identity: WeaveDBUserIdentity }>;
}

declare type WeaveDBInstance = typeof SDK.instance;
declare type WeaveDB = typeof SDK;

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
    issuedAt?: string;
    expirationTime?: string;
    siwe?: SiweMessage;
    weavedbUser?: WeaveDBUserObject;
  }
}
