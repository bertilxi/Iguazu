export const iguazu = Object.freeze({
  to(promise) {
    return promise.then(data => [null, data]).catch(err => [err]);
  }
});
