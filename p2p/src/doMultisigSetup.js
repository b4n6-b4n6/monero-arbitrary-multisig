import chalk from "chalk";
import createDebug from "debug";
import { myFetch } from "./myFetch.js";
import { waitForAllParties } from "./waitForParties.js";
const debug = createDebug("doMultisigSetup");

export const doMultisigSetup = async (config) => {
  const { parties, M, N, wallet } = config;

  await waitForAllParties(config);
  console.log("I can connect to all parties!");

  // prepare and collect multisig hex from each participant
  const preparedMultisigHexes = await Promise.all(
    Object
      .entries(parties)
      .map(([_, host]) => (
        myFetch(host, "prepare_multisig", undefined, config)
      ))
  );
  debug("preparedMultisigHexes", preparedMultisigHexes);

  // make each wallet multisig and collect results
  const madeMultisigHexes = await Promise.all(
    Object
      .entries(parties)
      .map(([_, host], i) =>
        myFetch(
          host,
          "make_multisig",
          preparedMultisigHexes.filter((_, j) => j !== i),
          config,
        )
      )
  );
  debug("madeMultisigHexes", madeMultisigHexes);

  // exchange multisig keys N - M + 1 times
  let multisigHexes = madeMultisigHexes;
  for (let i = 0; i < N - M + 1; i++) {
    multisigHexes = (
      await Promise.all(
        Object
          .entries(parties)
          .map(([_, host], i) =>
            myFetch(
              host,
              "exchange_multisig_keys",
              multisigHexes,
              config,
            )
          )
      )
    );
    debug("multisigHexes", multisigHexes);
  }

  const info = await wallet.getMultisigInfo();
  if (!(info.isMultisig === true && info.isReady === true)) {
    console.error("Wallet is still not multisig");
    process.exit(1);
  }

  console.log(`Your wallet address is ${chalk.magenta(await wallet.getAddress(0, 0))}`);
};
