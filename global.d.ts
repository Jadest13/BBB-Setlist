// global.d.ts

import type { MongoClient } from "mongodb";

declare global {
  namespace globalThis {
    let _mongo: Promise<MongoClient>;
  }
}
