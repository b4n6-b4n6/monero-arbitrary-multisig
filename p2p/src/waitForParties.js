import { myFetchNoThrow } from "./myFetchNoThrow.js";
import sleep from "sleep-promise";

const pingParties = (parties) => (
  Promise.all(
    parties.map((host) => myFetchNoThrow(host, "ruok"))
  )
);

const getAvailableParties = async (parties) => {
  const pongs = await pingParties(parties);
  return parties.filter((_, i) => pongs[i] === "imok");
};

const waitForParties = async (partyHosts, waitFor) => {
  for (;;) {
    const availablePartyHosts = await getAvailableParties(partyHosts);

    if (availablePartyHosts.length < waitFor) {
      console.log("Cannot connect to enough parties");
      console.log("Retrying in 10 seconds");
      await sleep(10 * 1000);
      continue;
    }

    console.log("Connected to parties", availablePartyHosts);
    return availablePartyHosts;
  }
};

export const waitForAllParties = (config) => (
  waitForParties(
    Object.values(config.parties),
    config.N
  )
);

export const waitForMinParties = (config) => (
  waitForParties(
    Object
      .values(config.parties)
      .filter((host) => host !== config.myWalletHost),
    config.M - 1
  )
);
