"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const COLORS = ["#171717", "#737373", "#a3a3a3", "#d4d4d4", "#e5e5e5"];

export function OrdersByMonthChart({ data }: { data: { month: string; orders: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
        <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="orders" stroke="#171717" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ProductsByCategoryChart({ data }: { data: { category: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
        <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#171717" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WardrobeRequestsChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
