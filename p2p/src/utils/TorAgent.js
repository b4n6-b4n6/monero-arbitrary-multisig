import { SocksProxyAgent } from "socks-proxy-agent";

const SOCKS_PORT = 9050;

export const TorAgent = () => (
  new SocksProxyAgent(
    `socks5h://localhost:${SOCKS_PORT}`,
    {
      keepAlive: true
    }
  )
);
