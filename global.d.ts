/* eslint-disable no-var */
// global.d.ts

import type { MongoClient } from "mongodb";

declare global {
  namespace globalThis {
    var _mongo: Promise<MongoClient>;
  }
}

export {};
