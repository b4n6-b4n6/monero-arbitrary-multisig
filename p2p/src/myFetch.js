import fetch from "node-fetch";
import { createTimer } from "./utils/createTimer.js";
import { TorAgent } from "./utils/TorAgent.js";

const TIMEOUT = 30 * 1000;
const agent = TorAgent();

export const myFetch = async (host, path, args = [], { secret }) => {
  const timer = createTimer();

  let res;
  try {
    res = await fetch(
      `http://${host}/${path}`,
      {
        method: "POST",
        body: JSON.stringify({ args, secret }),
        signal: AbortSignal.timeout(TIMEOUT),
        agent,
    });

    console.log("myFetch", `${host}/${path}`, `${timer()}ms`);
  } catch (error) {
    console.error("myFetch error", `${host}/${path}`, error?.message, `${timer()}ms`);
    throw new Error("myFetch error");
  }

  if (!res.ok) { throw new Error(`myFetch is not ok, is ${res.status}`); }

  return res.text();
};
