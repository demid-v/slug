export type SetState<T> = (action: T | ((prevState: T) => T)) => void;
