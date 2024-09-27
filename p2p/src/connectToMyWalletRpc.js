import { connectToWalletRpc } from "monero-ts";

export const connectToMyWalletRpc = ({ portRpc }) => (
  connectToWalletRpc(`http://localhost:${portRpc}`)
);
