import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const getArgs = () => (
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
    .help()
    .argv
);
