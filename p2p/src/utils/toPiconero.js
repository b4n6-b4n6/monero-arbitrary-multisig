export const toPiconero = (monero) => {
  const [up, down] = monero.split(".");

  return (
    BigInt(up) * BigInt(1e12) +
    (down ? BigInt(down.padEnd(12, "0")) : 0n)
  );
};
