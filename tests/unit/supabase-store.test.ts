import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseStore } from "@/lib/store/supabase-store";
import type { FamilyState } from "@/lib/types";

function fakeClient(
  rows: Map<string, FamilyState>,
  fail = false,
): SupabaseClient {
  return {
    from() {
      return {
        select() {
          return {
            eq(_column: string, id: string) {
              return {
                maybeSingle: async () => {
                  if (fail) {
                    return {
                      data: null,
                      error: { message: "relation does not exist" },
                    };
                  }
                  return {
                    data: rows.has(id) ? { state: rows.get(id) } : null,
                    error: null,
                  };
                },
              };
            },
          };
        },
        insert: async (row: { id: string; state: FamilyState }) => {
          if (rows.has(row.id)) {
            return {
              error: { code: "23505", message: "duplicate key value" },
            };
          }
          rows.set(row.id, row.state);
          return { error: null };
        },
        upsert: async (row: { id: string; state: FamilyState }) => {
          rows.set(row.id, row.state);
          return { error: null };
        },
      };
    },
  } as unknown as SupabaseClient;
}

describe("Supabase store adapter", () => {
  it("seeds a missing row, then persists mutations and resets", async () => {
    const rows = new Map<string, FamilyState>();
    const store = new SupabaseStore({
      client: fakeClient(rows),
      rowId: "test-family",
    });

    const seeded = await store.read();
    expect(seeded.family.name).toBe("The Bennett Family");
    expect(rows.has("test-family")).toBe(true);

    await store.mutate((state) => {
      state.family.name = "The Cloud Family";
    });
    const read = await store.read();
    expect(read.family.name).toBe("The Cloud Family");

    const reset = await store.reset();
    expect(reset.family.name).toBe("The Bennett Family");
    expect(rows.get("test-family")?.family.name).toBe("The Bennett Family");
  });

  it("does not let a racing first read overwrite an existing row", async () => {
    const rows = new Map<string, FamilyState>();
    const client = fakeClient(rows);
    const first = new SupabaseStore({ client, rowId: "race-family" });
    const second = new SupabaseStore({ client, rowId: "race-family" });

    await Promise.all([first.read(), second.read()]);
    await first.mutate((state) => {
      state.family.name = "After the Race";
    });

    expect((await second.read()).family.name).toBe("After the Race");
    expect(rows.get("race-family")?.family.name).toBe("After the Race");
  });

  it("surfaces a clear migration error when the table is missing", async () => {
    const store = new SupabaseStore({
      client: fakeClient(new Map(), true),
      rowId: "test-family",
    });
    await expect(store.read()).rejects.toThrow(/supabase/i);
    await expect(store.read()).rejects.toThrow(/migration/i);
  });
});
