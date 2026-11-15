import { promises as fs } from "node:fs";
import path from "node:path";
import type { FamilyState } from "@/lib/types";
import type { MutationResult, Store } from "@/lib/store/types";
import { createSeedState } from "@/lib/store/seed";
import { SupabaseStore } from "@/lib/store/supabase-store";

type StoreFile = {
  version: number;
  state: FamilyState;
};

const STORE_VERSION = 1;

function dataFilePath(): string {
  if (process.env.KINORA_DATA_FILE) {
    return path.resolve(process.env.KINORA_DATA_FILE);
  }
  const dir = process.env.KINORA_DATA_DIR ?? path.join(process.cwd(), ".data");
  return path.join(
    path.resolve(/* turbopackIgnore: true */ dir),
    "kinora.json",
  );
}

export class FileStore implements Store {
  private readonly file: string;
  private queue: Promise<unknown> = Promise.resolve();
  private initialized = false;

  constructor(file = dataFilePath()) {
    this.file = file;
  }

  private async ensureFile(): Promise<void> {
    if (this.initialized) return;
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    try {
      await fs.access(this.file);
    } catch {
      await this.write(createSeedState());
    }
    this.initialized = true;
  }

  private async write(state: FamilyState): Promise<void> {
    const payload: StoreFile = { version: STORE_VERSION, state };
    const temp = `${this.file}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(temp, JSON.stringify(payload, null, 2), "utf8");
    await fs.rename(temp, this.file);
  }

  private async readFile(): Promise<FamilyState> {
    await this.ensureFile();
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const parsed = JSON.parse(raw) as StoreFile;
      if (!parsed.state || parsed.version !== STORE_VERSION) {
        throw new Error("unsupported store version");
      }
      return parsed.state;
    } catch {
      const seeded = createSeedState();
      await this.write(seeded);
      return seeded;
    }
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const next = this.queue.then(task, task);
    this.queue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  read(): Promise<FamilyState> {
    return this.enqueue(() => this.readFile());
  }

  mutate<T>(
    mutator: (state: FamilyState) => T | Promise<T>,
  ): Promise<MutationResult<T>> {
    return this.enqueue(async () => {
      const state = await this.readFile();
      const result = await mutator(state);
      await this.write(state);
      return { state, result };
    });
  }

  reset(state: FamilyState = createSeedState()): Promise<FamilyState> {
    return this.enqueue(async () => {
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      await this.write(state);
      this.initialized = true;
      return state;
    });
  }
}

const globalForStore = globalThis as unknown as {
  __kinoraStore?: Store;
};

export type StoreBackend = "file" | "supabase";

export function storeBackend(): StoreBackend {
  const value = (process.env.DATA_BACKEND ?? "file").toLowerCase();
  if (value === "supabase") return "supabase";
  if (value === "file") return "file";
  throw new Error(`Unknown DATA_BACKEND "${value}". Use "file" or "supabase".`);
}

export function getStore(): Store {
  if (!globalForStore.__kinoraStore) {
    globalForStore.__kinoraStore =
      storeBackend() === "supabase" ? new SupabaseStore() : new FileStore();
  }
  return globalForStore.__kinoraStore;
}
