import { Constructor } from "./common";

export function Frozen(target: Constructor) {
  Object.freeze(target);
  Object.freeze(target.prototype);
}
