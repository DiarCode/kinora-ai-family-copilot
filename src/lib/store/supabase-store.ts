import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { FamilyState } from "@/lib/types";
import type { MutationResult, Store } from "@/lib/store/types";
import { createSeedState } from "@/lib/store/seed";

const DEMO_ROW_ID = "bennett-demo";
const TABLE = "kinora_state";

/**
 * Optional production backend. It stores the whole family snapshot in one
 * JSONB row, which matches the app's repository interface exactly. The default
 * local backend is the file store; set DATA_BACKEND=supabase to use this.
 *
 * The migration in supabase/migrations/0001_kinora_state.sql creates the table
 * and demo-scoped RLS policies. For a real multi-family deployment, replace the
 * demo policy with authenticated, per-family ownership.
 */
export class SupabaseStore implements Store {
  private readonly client: SupabaseClient;
  private queue: Promise<unknown> = Promise.resolve();

  constructor({
    url,
    key,
    rowId = DEMO_ROW_ID,
    client,
  }: {
    url?: string;
    key?: string;
    rowId?: string;
    client?: SupabaseClient;
  } = {}) {
    const resolvedUrl = url ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const resolvedKey =
      key ??
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!client && (!resolvedUrl || !resolvedKey)) {
      throw new Error(
        "Supabase backend requires NEXT_PUBLIC_SUPABASE_URL and a Supabase key.",
      );
    }
    this.client =
      client ??
      createClient(resolvedUrl!, resolvedKey!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    this.rowId = rowId;
  }

  private rowId: string;

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const next = this.queue.then(task, task);
    this.queue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  private async write(state: FamilyState): Promise<void> {
    const { error } = await this.client.from(TABLE).upsert(
      {
        id: this.rowId,
        state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) {
      throw new Error(
        `Could not write the family state to Supabase: ${error.message}. Did you run supabase/migrations/0001_kinora_state.sql?`,
      );
    }
  }

  /**
   * Seed with an INSERT, not an upsert. Two overlapping first requests (for
   * example the page render and a mood check-in) must not let the seed
   * overwrite a mutation that was already written. If another process won the
   * insert, read and return its row instead.
   */
  private async seed(): Promise<FamilyState> {
    const seeded = createSeedState();
    const { error } = await this.client.from(TABLE).insert({
      id: this.rowId,
      state: seeded,
      updated_at: new Date().toISOString(),
    });
    if (error && error.code !== "23505") {
      throw new Error(
        `Could not seed the family state in Supabase: ${error.message}. Did you run supabase/migrations/0001_kinora_state.sql?`,
      );
    }
    if (error?.code === "23505") {
      const { data, error: readError } = await this.client
        .from(TABLE)
        .select("state")
        .eq("id", this.rowId)
        .maybeSingle();
      if (readError) {
        throw new Error(
          `Could not read the family state from Supabase: ${readError.message}.`,
        );
      }
      if (data?.state) return data.state as FamilyState;
    }
    return seeded;
  }

  read(): Promise<FamilyState> {
    return this.enqueue(async () => {
      const { data, error } = await this.client
        .from(TABLE)
        .select("state")
        .eq("id", this.rowId)
        .maybeSingle();
      if (error) {
        throw new Error(
          `Could not read the family state from Supabase: ${error.message}. Did you run supabase/migrations/0001_kinora_state.sql?`,
        );
      }
      if (!data?.state) {
        return this.seed();
      }
      return data.state as FamilyState;
    });
  }

  mutate<T>(
    mutator: (state: FamilyState) => T | Promise<T>,
  ): Promise<MutationResult<T>> {
    return this.enqueue(async () => {
      const { data, error } = await this.client
        .from(TABLE)
        .select("state")
        .eq("id", this.rowId)
        .maybeSingle();
      if (error) {
        throw new Error(
          `Could not read the family state from Supabase: ${error.message}. Did you run supabase/migrations/0001_kinora_state.sql?`,
        );
      }
      const state =
        (data?.state as FamilyState | undefined) ?? (await this.seed());
      const result = await mutator(state);
      await this.write(state);
      return { state, result };
    });
  }

  reset(state: FamilyState = createSeedState()): Promise<FamilyState> {
    return this.enqueue(async () => {
      await this.write(state);
      return state;
    });
  }
}
