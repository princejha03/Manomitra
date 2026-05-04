"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { EmotionProfile } from "@/store/useStore";
import { calculateMoodTrend } from "@/lib/utils";

export default function EmotionTrendChart({
  emotionHistory,
  days = 7,
}: {
  emotionHistory: EmotionProfile[];
  days?: number;
}) {
  const data = calculateMoodTrend(emotionHistory, days);

  if (data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-foreground/40">
        <p>No emotion data yet. Start tracking your emotions!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "12px" }}
        />
        <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="avgIntensity"
          stroke="#6c63ff"
          fillOpacity={1}
          fill="url(#colorIntensity)"
          name="Mood Intensity"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
