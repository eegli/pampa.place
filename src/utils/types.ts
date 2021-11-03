export type OrNull<T> = T | null;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type PickActual<T, P extends keyof T> = T[P];
export type PickActualPartial<T, P extends keyof T> = Partial<T[P]>;
