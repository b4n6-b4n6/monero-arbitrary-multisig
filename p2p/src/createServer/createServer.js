import Koa from "koa";
import Router from "@koa/router";
import { koaBody } from "koa-body";
import createDebug from "debug";
import { createDebounced } from "../utils/createDebounced.js";
import { WALLET_PASSWORD } from "../const.js";
import { createCheckSecret } from "./createCheckSecret.js";
import { askToSign } from "../utils/askToSign.js";
const debug = createDebug("createServer");

export const createServer = (config) => {
  const { portHs, M, wallet } = config;
  const checkSecret = createCheckSecret(config);

  const app = new Koa();
  const router = new Router();

  const prepareMultisig_d = createDebounced(async () => {
    debug("prepare_multisig");
    const result = await wallet.prepareMultisig();
    debug("prepare_multisig result", result);

    return result;
  });
  const makeMultisig_d = createDebounced(async (hexes) => {
    debug("make_multisig", hexes);
    const result = await wallet.makeMultisig(hexes, M, WALLET_PASSWORD);
    debug("make_multisig result", result);

    return result;
  });
  const exchangeMultisigKeys_d = createDebounced(async (hexes) => {
    debug("exchange_multisig_keys", hexes);
    const result = await wallet.exchangeMultisigKeys(hexes, WALLET_PASSWORD);
    debug("exchange_multisig_keys result", result);

    return result.getMultisigHex();
  });
  const exportMultisigHex_d = createDebounced(async () => {
    debug("export_multisig_info");

    console.log("Syncing...");
    await wallet.sync();
    console.log("Synced");

    const result = await wallet.exportMultisigHex();
    debug("export_multisig_info", result);

    return result;
  });
  const signMultisig = async (hex) => {
    console.log("Received multisig spend request");
    const isApproved = await askToSign(
      (await wallet.describeMultisigTxSet(hex))
        .getTxs()
        .map(tx => (
          tx.getOutgoingTransfer().getDestinations()
        ))
        .flat()
    );

    if (!isApproved) {
      return "";
    }

    debug("sign_multisig", hex);
    const result = await wallet.signMultisigTxHex(hex);
    debug("sign_multisig result", result);

    return result.getSignedMultisigTxHex();
  };

  router.post("/ruok", async (ctx) => {
    ctx.body = "imok";
    ctx.status = 200;
  });

  router.post("/prepare_multisig", koaBody(), checkSecret, async (ctx) => {
    ctx.body = await prepareMultisig_d();
    ctx.status = 200;
  });
  router.post("/make_multisig", koaBody(), checkSecret, async (ctx) => {
    const { args } = JSON.parse(ctx.request.body);

    ctx.body = await makeMultisig_d(args);
    ctx.status = 200;
  });
  router.post("/exchange_multisig_keys", koaBody(), checkSecret, async (ctx) => {
    const { args } = JSON.parse(ctx.request.body);

    ctx.body = await exchangeMultisigKeys_d(args);
    ctx.status = 200;
  });

  router.post("/export_multisig_info", koaBody(), checkSecret, async (ctx) => {
    ctx.body = await exportMultisigHex_d();
    ctx.status = 200;
  });

  router.post("/sign_multisig", koaBody(), checkSecret, async (ctx) => {
    const { args } = JSON.parse(ctx.request.body);

    const result = await signMultisig(args);
    ctx.body = result;
    ctx.status = 200;
  });

  app.use(router.routes());
  const server = app.listen(
    portHs,
    () => { console.log(`Server litening on ${portHs}`); }
  );

  return () => server.close();
};
