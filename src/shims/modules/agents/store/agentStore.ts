type Selector = (s: any) => any;

const createStoreShim = () => {
  const fn: any = (selector?: Selector) => {
    if (typeof selector === "function") return selector({});
    return fn;
  };
  fn.getState = () => ({});
  fn.subscribe = () => () => {};
  return fn;
};

export const useAgentStore = createStoreShim();
