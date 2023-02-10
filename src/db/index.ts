/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { JWKInterface } from "arweave/node/lib/wallet";
import type { WeaveDB, WeaveDBInstance } from "../../additional";

const SDK: WeaveDB = require("weavedb-sdk");

interface IContractTx {
  contractTxId: string;
  srcTxId: string;
}

const run = () => {
  const WEAVEDB_CONTRACT_TXID: IContractTx = require("../weavedb/.wallets/contract-tx.json");

  const ADMIN_ARWEAVE_WALLET: JWKInterface = require("../weavedb/.wallets/admin-wallet.json");

  function getContractTxId() {
    if (WEAVEDB_CONTRACT_TXID) {
      return WEAVEDB_CONTRACT_TXID.contractTxId;
    }
    return process.env.CONTRACT_TX_ID as string;
  }

  async function initialize(db: WeaveDBInstance) {
    if (ADMIN_ARWEAVE_WALLET) {
      db.initialize({
        wallet: ADMIN_ARWEAVE_WALLET,
      });
    } else {
      await db.initializeWithoutWallet();
    }
  }

  return { getContractTxId, initialize };
};

const db = async (
  contractTxId?: string
): Promise<{
  _db: WeaveDBInstance;
  contractTxId: string;
}> => {
  const { getContractTxId, initialize } = run();

  if (!contractTxId) {
    contractTxId = getContractTxId();
  }

  const _db = new SDK({
    contractTxId,
  });

  await initialize(_db);

  return { _db, contractTxId };
};

export default db;
