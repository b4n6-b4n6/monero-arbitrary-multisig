export const createDebounced = (func) => {
  const activeTasks = {};

  return (keys = []) => {
    const key = keys.join("-");

    if (!activeTasks[key]) {
      activeTasks[key] = func(keys);
    }

    return activeTasks[key];
  };
};
