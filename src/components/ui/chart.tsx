"use client";

import React, { createContext, useContext } from "react";
import { ResponsiveContainer, Tooltip, Legend } from "recharts";

export type ChartConfig = {
  [key: string]: {
    label?: string;
    color?: string;
  };
};

type ChartContextType = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextType | undefined>(undefined) as React.Context<ChartContextType>;

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within ChartContainer");
  }
  return context;
}

export function ChartContainer({
  config,
  children,
  className,
}: {
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={className}>
        <ResponsiveContainer width="100%" height={300}>
          {children as any}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;
export const ChartLegend = Legend;
