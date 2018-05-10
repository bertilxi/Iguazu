import * as Axios from "axios";
import { EventBus } from "./bus";

const axios = Axios.default;

// Lightweigth pollyfill for Firefox and others
Promise.prototype.finally =
  Promise.prototype.finally ||
  function(callback: any) {
    return this.then(
      value => this.constructor.resolve(callback()).then(() => value),
      reason =>
        this.constructor.resolve(callback()).then(() => {
          throw reason;
        })
    );
  };

const options = {
  baseUrl: "/api/",
  headers: {
    "Content-Type": "application/json"
  }
};

let api = axios.create(options);

const checkJWT = () => {
  const jwt = localStorage.getItem("jwt");
  const jwtOptions: any = { ...options };
  jwtOptions.headers.Authorization = jwt ? `Bearer ${jwt}` : undefined;
  api = axios.create(jwtOptions);
  return Promise.resolve(api);
};

const handleResponse = response => Promise.resolve(response.data);

const handleError = error => {
  error.response.status === 401
    ? EventBus.emit("logout")
    : EventBus.emit("NETWORK_ERROR");
  return Promise.reject(error);
};

const startLoading = () => Promise.resolve();
const endLoading = () => Promise.resolve();

const request = (method, ...args) => {
  return startLoading()
    .then(checkJWT)
    .then(mApi => mApi[method](...args))
    .then(handleResponse)
    .catch(handleError)
    .finally(() => endLoading());
};

const get = path => request("get", path);
const post = (path, data) => request("post", path, data);
const del = path => request("delete", path);

export const Api = {
  listen: get,
  get,
  post,
  delete: del,
  checkJWT
};
