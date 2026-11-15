import type { FamilyState } from "@/lib/types";

export type MutationResult<T> = {
  state: FamilyState;
  result: T;
};

export interface Store {
  read(): Promise<FamilyState>;
  mutate<T>(
    mutator: (state: FamilyState) => T | Promise<T>,
  ): Promise<MutationResult<T>>;
  reset(state?: FamilyState): Promise<FamilyState>;
}
