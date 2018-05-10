import { Subscription } from "rxjs/internal/Subscription";

import { Websocket } from "../../service";

const subscriptions: Subscription[] = [];

export async function websocket({ commit }, { Model, id, query, as }) {
  const path = id ? `/${Model.path}/${id}` : `/${Model.path}`;
  const sub: Subscription = Websocket.get(path).subscribe(value => {
    const key = as ? as : Array.isArray(value) ? Model.list : Model.item;
    commit("SET_STATE", { key, value });
  });
  subscriptions.push(sub);
}

export async function clearWebsockets() {
  subscriptions.forEach(sub => {
    sub.unsubscribe();
  });
}
