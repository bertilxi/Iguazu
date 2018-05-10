import { Observable } from "rxjs/internal/Observable";
import * as io from "socket.io-client";
import { Api } from "./api";

let socket;

const getSocket = () => {
  socket = socket || io();
  return socket;
};

const get = path => {
  return Observable.create(observer => {
    getSocket().on(path, data => {
      observer.next(data);
    });
    Api.get(`/ws/${path}`);
  });
};

export const Websocket = {
  get
};
