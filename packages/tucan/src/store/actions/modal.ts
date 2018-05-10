export function showModal({ commit, state }, { modal, body, options }) {
  const modalState = { ...state.showModal };
  if (!options || !options.keep) {
    Object.keys(modalState).forEach(key => {
      modalState[key] = false;
    });
  }
  modalState[modal] = true;
  commit("SET_STATE", { key: "modalOptions", value: options });
  commit("SET_STATE", { key: modal, value: body });
  commit("SET_STATE", { key: "showModal", value: modalState });
}
