/* tslint:disable:no-console */
import { Api, tucan } from "../../service";

export async function get({ commit }, { Model, id, query, as }) {
  let path;
  if (id) {
    path = `/api/${Model.path}/${id}`;
  } else if (query) {
    path = `/api/${Model.path}${query}`;
  } else {
    path = `/api/${Model.path}`;
  }
  const [error, value] = await tucan.to(Api.get(path));

  if (error) {
    return console.error(`Error fetching ${Model.name}`);
  }

  if (typeof Model.map === "function") {
    Model.map(value);
  }

  const key = as ? as : Array.isArray(value) ? Model.list : Model.item;
  commit("SET_STATE", { key, value });
  return value;
}

export async function getAny({ commit }, { path, key, map }) {
  const [error, value] = await tucan.to(Api.get(`/api/${path}`));

  if (error) {
    return console.error(`Error fetching ${key}`);
  }

  map(value);

  return commit("SET_STATE", { key, value });
}

export async function add(store, { Model, body }) {
  const [error, newEntity] = await tucan.to(
    Api.post(`/api/${Model.path}`, body)
  );

  if (error) {
    return console.error(`Error Creating ${Model.name}`);
  }

  return newEntity;
}

export async function remove(store, { Model, id }) {
  const [error] = await tucan.to(Api.delete(`/api/${Model.path}/${id}`));

  if (error) {
    return console.error(`Error Deleting ${Model.name}`);
  }
}
