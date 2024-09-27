import fetch from "node-fetch";
import { createTimer } from "./utils/createTimer.js";
import { TorAgent } from "./utils/TorAgent.js";

const TIMEOUT = 30 * 1000;
const agent = TorAgent();

export const myFetchNoThrow = async (host, path) => {
  const timer = createTimer();

  let res;
  try {
    res = await fetch(
      `http://${host}/${path}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(TIMEOUT),
        agent,
    });

    console.log("myFetchNoThrow", `${host}/${path}`, `${timer()}ms`);
  } catch (error) {
    console.error("myFetchNoThrow error", `${host}/${path}`, error?.message, `${timer()}ms`);
    return null;
  }

  if (!res.ok) {
    console.log("myFetchNoThrow is not ok", res.status);
    return null;
  }

  return res.text();
};
