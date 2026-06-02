type Selector = (s: any) => any;

const createStoreShim = () => {
  const fn: any = (selector?: Selector) => {
    if (typeof selector === "function") return selector({});
    return fn;
  };
  fn.getState = () => ({});
  fn.subscribe = () => () => {};
  fn.hydrate = () => Promise.resolve();
  return fn;
};

export const useAgentsStore = createStoreShim();
