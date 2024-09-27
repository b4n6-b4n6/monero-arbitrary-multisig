import createDebug from "debug";
import { myFetch } from "./myFetch.js";
import { waitForMinParties } from "./waitForParties.js";
import { toPiconero } from "./utils/toPiconero.js";
import { checkIsValidAddress } from "./utils/checkIsValidAddress.js";
const debug = createDebug("doMultisigSpend");

export const doMultisigSpend = async (config) => {
  const { wallet, spendAddress, spendAmount } = config;

  const info = await wallet.getMultisigInfo();
  if (!(info.isMultisig === true && info.isReady === true)) {
    console.error("Wallet is not multisig");
    process.exit(1);
  }

  if (!(await checkIsValidAddress(spendAddress))) {
    console.error("Spend address is not valid");
    process.exit(1);
  }

  console.log("Syncing...");
  await wallet.sync();
  console.log("Synced");

  const picos = toPiconero(spendAmount);
  if (picos > (await wallet.getUnlockedBalance())) {
    console.error("Not enough unlocked amount for spend");
    process.exit(1);
  }

  if (picos <= 0n) {
    console.error("Spend amount must be positive");
    process.exit(1);
  }

  const partyHosts = await waitForMinParties(config);
  console.log("I can connect to enough parties!");

  const tx = await wallet.createTx({
    address: spendAddress,
    amount: picos,
    accountIndex: 0,
    subaddressIndex: 0,
  });

  if (!tx) {
    console.error("Cannot create tx");
    process.exit(1);
  }

  // TODO display fee here

  let multisigHex = tx.getTxSet().getMultisigTxHex();
  for (let host of partyHosts) {
    multisigHex = await myFetch(host, "sign_multisig", multisigHex, config);
    debug("multisigHex", multisigHex);

    if (multisigHex === "") {
      console.error("Spend sign refused!");
      process.exit(1);
    }
  }

  const hashes = await wallet.submitMultisigTxHex(multisigHex);
  console.log("Submitted", hashes);
};
