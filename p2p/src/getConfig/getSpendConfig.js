import { getSpendArgs } from "./getSpendArgs.js";
import { getConfig } from "./getConfig.js";

export const getSpendConfig = () => {
  const args = getSpendArgs();

  return {
    ...getConfig(args),
    spendAmount: args.spendAmount,
    spendAddress: args.spendAddress,
  };
};
