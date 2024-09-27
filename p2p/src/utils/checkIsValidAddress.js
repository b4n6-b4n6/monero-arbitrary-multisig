import { MoneroUtils, MoneroNetworkType } from "monero-ts";

export const checkIsValidAddress = (address) => (
  MoneroUtils.isValidAddress(address, MoneroNetworkType.MAINNET)
);
