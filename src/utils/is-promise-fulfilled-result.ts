const isPromiseFulfilledResult = <T>(
  promise: PromiseSettledResult<T>,
): promise is PromiseFulfilledResult<T> => promise.status === "fulfilled";

export default isPromiseFulfilledResult;
