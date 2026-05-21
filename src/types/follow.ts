import type { UserRecord } from './user';

export type FollowRecord = {
  id: string;
  follower: string;
  following: string;
  expand?: {
    following?: UserRecord;
  };
};
