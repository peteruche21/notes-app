/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { WeaveDB, WeaveDBInstance } from "../../additional";
import Wallet from "ethereumjs-wallet";
import { toBuffer } from "ethereumjs-util";

const server: WeaveDB = require("weavedb-node-client");

interface IContractTx {
  contractTxId: string;
  srcTxId: string;
}

const db = (
  contractTxId?: string
): {
  _db: WeaveDBInstance;
  contractTxId: string;
} => {

  if (!contractTxId) {
    try {
      contractTxId = (require("../weavedb/.wallets/contract-tx.json") as IContractTx).contractTxId;
    } catch (error: unknown) {
      contractTxId = process.env.CONTRACT_TX_ID as string;
    }
  }

  const EthWallet = Wallet.fromPrivateKey(
    toBuffer(process.env.ADMIN_ETH_PRIVATE_KEY)
  );

  const _db = new server({
    contractTxId,
    rpc: process.env.GRPC_NODE_URL || "127.0.0.1:8080",
    EthWallet,
  });

  return { _db, contractTxId };
};

export default db;
