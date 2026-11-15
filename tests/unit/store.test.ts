import { afterEach, describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { FileStore } from "@/lib/store";
import type { Child, FamilyState } from "@/lib/types";

const tempDirs: string[] = [];

async function tempStore() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "kinora-store-"));
  tempDirs.push(dir);
  return new FileStore(path.join(dir, "kinora.json"));
}

function child(index: number): Child {
  return {
    id: `child-${index}`,
    name: `Child ${index}`,
    birthDate: "2020-01-01",
    avatarColor: "#7C9CF5",
    createdAt: new Date().toISOString(),
    assessments: [],
  };
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })),
  );
});

describe("file store", () => {
  it("seeds a family on first read", async () => {
    const store = await tempStore();
    const state = await store.read();
    expect(state.family.name).toBe("The Bennett Family");
    expect(state.family.members).toHaveLength(2);
    expect(state.children[0].name).toBe("Sophie");
  });

  it("persists mutations atomically across reads", async () => {
    const store = await tempStore();
    await store.mutate((state) => {
      state.family.name = "The Test Family";
      state.settings.assistantName = "Test Kinora";
    });
    const reopened = await tempStore();
    expect(reopened).not.toBe(store);
    const state = await store.read();
    expect(state.family.name).toBe("The Test Family");
    expect(state.settings.assistantName).toBe("Test Kinora");
  });

  it("serializes concurrent mutations", async () => {
    const store = await tempStore();
    await store.read();
    await Promise.all(
      Array.from({ length: 12 }, (_, index) =>
        store.mutate((state) => {
          state.children.push(child(index));
        }),
      ),
    );
    const state = await store.read();
    expect(state.children).toHaveLength(13);
    expect(new Set(state.children.map((item) => item.id)).size).toBe(13);
  });

  it("can reset to a fresh seed", async () => {
    const store = await tempStore();
    await store.mutate((state) => {
      state.family.name = "Changed";
    });
    const reset = await store.reset();
    expect(reset.family.name).toBe("The Bennett Family");
    const state = await store.read();
    expect(state.family.name).toBe("The Bennett Family");
  });

  it("returns the mutator result alongside the state", async () => {
    const store = await tempStore();
    const { state, result } = await store.mutate<FamilyState["family"]>(
      (value) => value.family,
    );
    expect(result.name).toBe(state.family.name);
  });
});
