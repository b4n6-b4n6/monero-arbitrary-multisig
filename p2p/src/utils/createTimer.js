import { performance } from "perf_hooks";

export const createTimer = () => {
  const startTime = performance.now();
  return () => Math.round(performance.now() - startTime);
};
