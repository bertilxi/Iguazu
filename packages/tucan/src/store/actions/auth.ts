import { Api, EventBus, tucan } from "../../service";

export async function login({ commit }, { email, password }) {
  const [error, user] = await tucan.to(
    Api.post("/api/auth/login", { email, password })
  );

  if (error) {
    return false;
  }

  const token = user ? user.token : "";
  localStorage.setItem("jwt", token);
  commit("SET_STATE", { key: "user", value: user });
  commit("SET_STATE", { key: "jwt", value: token });
  return true;
}

export async function logout({ commit }) {
  commit("SET_STATE", { key: "user", value: undefined });
  commit("SET_STATE", { key: "jwt", value: undefined });
  localStorage.removeItem("jwt");
  EventBus.emit("logout");
}

export async function getUser({ commit }, id) {
  const [error, user] = await tucan.to(Api.get(`/api/user/${id}`));

  if (error) {
    throw new Error("Error fetching User");
  }
  return commit("SET_STATE", { key: "user", value: user });
}

export async function createUser({ commit, dispatch }, user) {
  const [error] = await tucan.to(Api.post("/api/auth/register", user));
  if (error) {
    throw new Error("Error registering user");
  } else {
    return dispatch("login", {
      email: user.email,
      password: user.password
    });
  }
}

export async function updateUser({ commit }, [user]) {
  user.roles = undefined;
  const [error] = await tucan.to(Api.post(`/api/user`, user));

  if (error) {
    throw new Error("Error Updating User");
  }
}
