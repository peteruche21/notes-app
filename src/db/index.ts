import { existsSync, readFileSync } from "fs";
import path from "path";
import type { JWKInterface } from "arweave/node/lib/wallet";
import type { WeaveDB, WeaveDBInstance } from "../../additional";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const SDK: WeaveDB = require("weavedb-sdk");

const db = async (): Promise<{
  _db: WeaveDBInstance;
  contractTxId: string;
}> => {
  const WEAVEDB_CONTRACT_TXID = path.resolve(
    __dirname,
    "../weavedb/.wallets/contract-tx.json"
  );
  const ADMIN_ARWEAVE_WALLET = path.resolve(
    __dirname,
    "../weavedb/.wallets/admin-wallet.json"
  );

  let contractTxId: string;

  if (existsSync(WEAVEDB_CONTRACT_TXID)) {
    console.log("src_contract_tx_id detected");
    contractTxId = (
      JSON.parse(readFileSync(WEAVEDB_CONTRACT_TXID, "utf8")) as {
        contractTxId: string;
      }
    ).contractTxId;
  } else {
    contractTxId = process.env.CONTRACT_TX_ID as string;
    console.log("src_contract_tx_id not detected");
  }

  const _db = new SDK({
    contractTxId,
  });

  if (existsSync(ADMIN_ARWEAVE_WALLET)) {
    _db.initialize({
      wallet: JSON.parse(
        readFileSync(ADMIN_ARWEAVE_WALLET, "utf8")
      ) as JWKInterface,
    });
    console.log("initialized sdk with admin wallet...");
  } else {
    await _db.initializeWithoutWallet();
    console.log("skipping initialization...");
  }

  return { _db, contractTxId };
};

export default db;
