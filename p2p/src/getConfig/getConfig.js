import YAML from "yaml";
import fs from "fs";
import { getArgs } from "./getArgs.js";

export const getConfig = (args) => {
  const { configPath, walletName } = args || getArgs();

  if (!fs.existsSync(`./wallets/${walletName}`)) {
    console.error("wallet does not exist in ./wallets folder");
    process.exit(1);
  }

  const portRpc = Number(fs.readFileSync(`./wallets/${walletName}/port-rpc`, "utf8"));
  const portHs = Number(fs.readFileSync(`./wallets/${walletName}/port-hs`, "utf8"));

  const config = YAML.parse(fs.readFileSync(configPath, "utf8"));
  if (!config.M) {
    console.error("Specify M in config");
    process.exit(1);
  }

  if (!config.parties || !Object.entries(config.parties).length) {
    console.error("Specify parties in config");
    process.exit(1);
  }

  if (config.M > config.parties.length) {
    console.error("Specify M less or equal to number of parties");
    process.exit(1);
  }

  if (!config.parties[walletName]) {
    console.error("Cannot find party corresponding to provided wallet");
    console.error("Specify party with same name as your wallet");
    process.exit(1);
  }

  const ret = {
    ...config,
    myWalletName: walletName,
    myWalletHost: config.parties[walletName],
    N: Object.entries(config.parties).length,
    portRpc,
    portHs,
  };

  console.log("config", ret);

  return ret;
};
