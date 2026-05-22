// src/types/collection.ts

import type { RecordModel } from 'pocketbase';

export type CollectionMember = RecordModel & {
  name?: string;
  email?: string;
};

export type Collection = RecordModel & {
  name: string;
  owner: string;
  members: string[];

  expand?: {
    members?: CollectionMember[];
  };
};
