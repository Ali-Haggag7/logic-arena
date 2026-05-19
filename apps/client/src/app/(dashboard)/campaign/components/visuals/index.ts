import type { ComponentType } from "react";
import { CondVis } from "./CondVis";
import { LoopVis } from "./LoopVis";
import { ArrVis } from "./ArrVis";
import { DsVis } from "./DsVis";
import { RecVis } from "./RecVis";
import { GfxVis } from "./GfxVis";

export const VIS_MAP: Record<string, ComponentType<{ order: number; c: string }>> = {
  cond: CondVis, loop: LoopVis, arr: ArrVis,
  ds: DsVis, rec: RecVis, gfx: GfxVis,
};
