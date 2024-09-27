import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const getSpendArgs = () => (
  yargs(hideBin(process.argv))
    .option("wallet-name", {
      describe: "Your wallet name (as specified in config file)",
      type: "string",
      demandOption: true
    })
    .option("config-path", {
      describe: "Your multisig config",
      type: "string",
      demandOption: true,
    })
    .option("spend-address", {
      describe: "Spend destination address",
      type: "string",
    })
    .option("spend-amount", {
      describe: "Spend amount",
      type: "string",
    })
    .help()
    .argv
);
