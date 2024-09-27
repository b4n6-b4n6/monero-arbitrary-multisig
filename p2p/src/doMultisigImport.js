import { myFetch } from "./myFetch.js";
import { waitForMinParties } from "./waitForParties.js";
import { fromPiconero } from "./utils/fromPiconero.js";

export const doMultisigImport = async (config) => {
  const { wallet } = config;

  const info = await wallet.getMultisigInfo();
  if (!(info.isMultisig === true && info.isReady === true)) {
    console.error("Wallet is not multisig");
    process.exit(1);
  }

  console.log("Syncing...");
  await wallet.sync();
  console.log("Synced");

  const partyHosts = await waitForMinParties(config);
  console.log("I can connect to enough parties!");

  const multisigHexes = await Promise.all(
    partyHosts.map((host) => myFetch(host, "export_multisig_info", undefined, config))
  );

  await wallet.importMultisigHex(multisigHexes);

  console.log(`Your unlocked balance is ${fromPiconero(await wallet.getUnlockedBalance())} XMR`);
  console.log(`Your locked balance is ${fromPiconero(await wallet.getBalance())} XMR`);
};
