import Vue from "vue";

const bus = new Vue();

export const EventBus = {
  emit: bus.$emit,
  on: bus.$on
};
