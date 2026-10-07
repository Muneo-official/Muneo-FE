import { type BathroomDetail } from './bathroom';
import { type CarpentryDetail } from './carpentry';
import { type DemolitionDetail } from './demolition';
import { type ElectricalDetail } from './electrical';
import { type FilmDetail } from './film';
import { type FinishingDetail } from './finishing';
import { type FlooringDetail } from './flooring';
import { type FurnitureDetail } from './furniture';
import { type KitchenDetail } from './kitchen';
import { type PaintingDetail } from './painting';
import { type PlumbingDetail } from './plumbing';
import { type SashDetail } from './sash';
import { type TileDetail } from './tile';
import { type WallpaperDetail } from './wallpaper';

export * from './bathroom';
export * from './carpentry';
export * from './demolition';
export * from './electrical';
export * from './film';
export * from './finishing';
export * from './flooring';
export * from './furniture';
export * from './kitchen';
export * from './painting';
export * from './plumbing';
export * from './sash';
export * from './tile';
export * from './wallpaper';

export interface ProcessDetailMap {
  demolition: DemolitionDetail;
  plumbing: PlumbingDetail;
  electrical: ElectricalDetail;
  carpentry: CarpentryDetail;
  wallpaper: WallpaperDetail;
  flooring: FlooringDetail;
  tile: TileDetail;
  bathroom: BathroomDetail;
  kitchen: KitchenDetail;
  painting: PaintingDetail;
  finishing: FinishingDetail;
  sash: SashDetail;
  film: FilmDetail;
  furniture: FurnitureDetail;
}

export type Step4Data = { [K in keyof ProcessDetailMap]?: Partial<ProcessDetailMap[K]> };
