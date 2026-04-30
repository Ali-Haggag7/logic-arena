"use client";

import React from "react";
import type { RobotConfig } from "../constants/robots.constants";

interface RobotSpecsProps {
  robot: RobotConfig;
  robotId: string;
  color: string;
}

export function RobotSpecs({ robot, robotId, color }: RobotSpecsProps) {
  return (
    <div className="border-b border-accent/10 pb-5">
      <p className="text-[9px] tracking-[0.28em] text-accent/35 mb-4 uppercase font-bold">
        // ROBOT SPECIFICATIONS
      </p>
      <div className="space-y-3">
        <SpecRow label="Designation" value={robot.name} />
        <SpecRow label="Model" value={robotId.toUpperCase()} />
        <SpecRow label="Class" value={robot.classification} />
        <div className="flex justify-between text-[10px] tracking-[0.12em] font-mono">
          <span className="text-accent/70 uppercase font-bold">Color</span>
          <span
            className="font-black drop-shadow-[0_0_8px_currentColor]"
            style={{ color: color !== "DEFAULT" ? color : "var(--accent)" }}
          >
            {color.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[10px] tracking-[0.12em] font-mono">
      <span className="text-accent/70 uppercase font-bold">{label}</span>
      <span className="text-accent/90 font-black">{value}</span>
    </div>
  );
}
