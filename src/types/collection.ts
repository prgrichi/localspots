// src/types/collection.ts

import type { RecordModel } from 'pocketbase';

export type Collection = RecordModel & {
  name: string;
  owner: string;
  members: string[];
};
