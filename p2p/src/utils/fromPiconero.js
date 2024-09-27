const _1e12n = BigInt(1e12);

export const fromPiconero = (picos) => {
  const fp = picos % _1e12n;
  const ip = (picos - fp) / _1e12n;
  const ips = ip.toString();
  const fps = (fp.toString().padStart(12, "0").replace(/0*$/, "") || "0");
  return ips + "." + fps;
};
