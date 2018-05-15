const state = new Map();

export const store = Object.freeze({
  set(key, value) {
    state.set(key, value);
  },
  get<T>(key) {
    return state.get(key) as T;
  }
});
