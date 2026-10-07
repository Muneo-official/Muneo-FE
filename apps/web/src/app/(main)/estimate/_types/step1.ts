import { type BathroomCount } from './step4/bathroom';

export const REGIONS = ['서울', '수도권', '지방'] as const;
export type Region = (typeof REGIONS)[number];

export const SPACE_TYPES = ['아파트', '빌라', '오피스텔', '단독 주택'] as const;
export type SpaceType = (typeof SPACE_TYPES)[number];

export const ROOM_COUNTS = ['1개', '2개', '3개', '4개 이상'] as const;
export type RoomCount = (typeof ROOM_COUNTS)[number];

export interface Step1Data {
  region: Region | null;
  spaceType: SpaceType | null;
  area: number | null;
  roomCount: RoomCount | null;
  bathroomCount: BathroomCount | null;
}
