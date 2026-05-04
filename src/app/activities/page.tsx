"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { formatDuration } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Star,
  Trash2,
  Filter,
  ChevronDown,
  Activity,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ActivitiesPage() {
  const { getActivityLogs, emotionHistory } = useStore();
  const { user: firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "rating">("recent");

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!firebaseUser) {
    return null;
  }

  const activityLogs = getActivityLogs(selectedType || undefined);
  const sorted = [...activityLogs].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return b.startTime - a.startTime;
  });

  const activityTypes = [
    "music",
    "yoga",
    "food",
    "sleep",
    "mental",
    "journaling",
    "breathing",
    "voice-emotion",
  ];

  const getActivityColor = (type: string) => {
    const colors: { [key: string]: string } = {
      music: "bg-blue-500/20 border-blue-500/30 text-blue-400",
      yoga: "bg-green-500/20 border-green-500/30 text-green-400",
      food: "bg-orange-500/20 border-orange-500/30 text-orange-400",
      sleep: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400",
      mental: "bg-purple-500/20 border-purple-500/30 text-purple-400",
      journaling: "bg-pink-500/20 border-pink-500/30 text-pink-400",
      breathing: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
      "voice-emotion": "bg-red-500/20 border-red-500/30 text-red-400",
    };
    return colors[type] || colors.music;
  };

  const stats = {
    totalActivities: activityLogs.length,
    avgRating:
      activityLogs.length > 0
        ? (
            activityLogs.reduce((sum, a) => sum + a.rating, 0) /
            activityLogs.length
          ).toFixed(1)
        : 0,
    totalDuration: activityLogs.reduce((sum, a) => sum + a.duration, 0),
    thisWeek: activityLogs.filter(
      (a) => a.startTime > Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).length,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Activity Log</h1>
          <p className="text-foreground/60">
            Track your wellness activities and see what helps most
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 bg-primary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">
                  Total Activities
                </p>
                <h3 className="text-3xl font-bold">{stats.totalActivities}</h3>
              </div>
              <Activity className="w-12 h-12 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-secondary/10 border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Avg Rating</p>
                <h3 className="text-3xl font-bold">{stats.avgRating}/5</h3>
              </div>
              <Star className="w-12 h-12 text-secondary opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-orange-500/10 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">
                  Total Duration
                </p>
                <h3 className="text-3xl font-bold">
                  {formatDuration(stats.totalDuration)}
                </h3>
              </div>
              <Clock className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-green-500/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">This Week</p>
                <h3 className="text-3xl font-bold">{stats.thisWeek}</h3>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedType === null
                ? "bg-primary text-white"
                : "bg-white/5 text-foreground/60 hover:bg-white/10"
            }`}
          >
            All Activities
          </button>
          {activityTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                selectedType === type
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {sorted.length} Activities Logged
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === "recent"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy("rating")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                sortBy === "rating"
                  ? "bg-primary text-white"
                  : "bg-white/5 text-foreground/60 hover:bg-white/10"
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          {sorted.length > 0 ? (
            sorted.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 border ${getActivityColor(activity.activityType)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold capitalize">
                          {activity.activityName}
                        </h3>
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs font-medium capitalize">
                          {activity.activityType}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {new Date(activity.startTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {formatDuration(activity.duration)}
                        </span>
                        {activity.mood && (
                          <span className="px-2 py-1 bg-white/10 rounded text-xs">
                            {activity.mood}
                          </span>
                        )}
                      </div>
                      {activity.feedback && (
                        <p className="text-sm text-foreground/70 mt-3 italic">
                          "{activity.feedback}"
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < activity.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-foreground/20"
                            }
                          />
                        ))}
                      </div>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-foreground/40 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-12 text-center border-dashed border-2 border-white/10">
              <Activity size={64} className="text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground/40 mb-2">
                No activities logged yet
              </h3>
              <p className="text-foreground/40">
                Start tracking your wellness activities to see insights
              </p>
            </Card>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}
