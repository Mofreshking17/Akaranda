"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

// AKARANDA brand palette
const TERRACOTTA = "#8B3A1A";
const GOLD = "#C9A84C";
const FOREST = "#2D5A3D";
const PIE_COLORS = [TERRACOTTA, GOLD, FOREST, "#A6764F", "#D9C7A3"];

const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--popover)",
    color: "var(--popover-foreground)",
    fontSize: 12,
  },
};

export function OrdersByMonthChart({ data }: { data: { month: string; orders: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TERRACOTTA} stopOpacity={0.25} />
            <stop offset="100%" stopColor={TERRACOTTA} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} stroke="var(--border)" />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} stroke="var(--border)" allowDecimals={false} />
        <Tooltip {...tooltipStyle} />
        <Area type="monotone" dataKey="orders" stroke={TERRACOTTA} strokeWidth={2.5} fill="url(#ordersFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProductsByCategoryChart({ data }: { data: { category: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} stroke="var(--border)" />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} stroke="var(--border)" allowDecimals={false} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
        <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WardrobeRequestsChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={48} outerRadius={88} paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
