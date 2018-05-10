import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const createRouter = routes =>
  new Router({
    mode: "history",
    routes
  });

export const setClearEvents = (router, store) => {
  router.beforeEach((to, from, next) => {
    store.dispatch("clearWebsockets");
    next();
  });
};
