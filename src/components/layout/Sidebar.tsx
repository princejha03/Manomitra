"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  MessageSquare,
  Smile,
  Mic,
  Heart,
  Target,
  Music,
  Moon,
  Settings,
  Sun,
  ChevronRight,
  Flame,
  Utensils,
  Brain,
  Activity,
  Menu,
  X,
  LogOut,
  BarChart3,
  BookOpen,
  Wind,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: MessageSquare, label: "Text Emotion", href: "/text-emotion" },
  { icon: Smile, label: "Face Scan", href: "/face-emotion" },
  { icon: Mic, label: "Voice Emotion", href: "/voice-emotion" },
  { icon: Heart, label: "Mood Support", href: "/mood-support" },
  {
    icon: Target,
    label: "Fit Zone",
    href: "/fit-zone",
    subItems: [
      { icon: Music, label: "Music", href: "/fit-zone/music" },
      { icon: Activity, label: "Yoga", href: "/fit-zone/yoga" },
      { icon: Brain, label: "Mental Health", href: "/fit-zone/mental" },
      { icon: Utensils, label: "Food", href: "/fit-zone/food" },
      { icon: Moon, label: "Sleep", href: "/fit-zone/sleep" },
    ],
  },
  { icon: BookOpen, label: "Journaling", href: "/journaling" },
  { icon: Wind, label: "Breathing", href: "/breathing" },
  { icon: Activity, label: "Activity Log", href: "/activities" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: MessageSquare, label: "Feedback", href: "/feedback" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [fitZoneOpen, setFitZoneOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user: firebaseUser } = useAuth();
  const { user, currentEmotion, streak, toggleDarkMode, isDarkMode } =
    useStore();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleToggleTheme = () => {
    toggleDarkMode();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card text-foreground lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className={cn(
          "fixed left-0 top-0 h-full z-40 bg-card border-r border-white/10 glass transition-all duration-300",
          !isOpen && "items-center",
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* User Profile Section */}
          <div
            className={cn(
              "flex items-center gap-3 mb-8",
              !isOpen && "justify-center",
            )}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: user?.avatarColor || "#6C63FF" }}
            >
              {firebaseUser?.displayName?.[0] ||
                firebaseUser?.email?.[0] ||
                "U"}
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-foreground">
                  {firebaseUser?.displayName || firebaseUser?.email || "Guest"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary self-start">
                  {currentEmotion?.dominantEmotion || "Neutral"}
                </span>
              </div>
            )}
          </div>

          {/* Streak Counter */}
          {isOpen && (
            <div className="flex items-center gap-2 mb-8 p-3 bg-white/5 rounded-xl border border-white/10">
              <Flame className="text-orange-500 animate-pulse" />
              <span className="text-sm font-medium">{streak} day streak</span>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => setFitZoneOpen(!fitZoneOpen)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5",
                        pathname.startsWith(item.href) &&
                          "bg-primary/20 text-primary",
                      )}
                    >
                      <item.icon size={24} />
                      {isOpen && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronRight
                            size={16}
                            className={cn(
                              "transition-transform",
                              fitZoneOpen && "rotate-90",
                            )}
                          />
                        </>
                      )}
                    </button>
                    <AnimatePresence>
                      {isOpen && fitZoneOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-lg text-sm transition-all hover:bg-white/5",
                                pathname === sub.href
                                  ? "text-primary"
                                  : "text-foreground/60",
                              )}
                            >
                              <sub.icon size={18} />
                              <span>{sub.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5",
                      pathname === item.href && "bg-primary/20 text-primary",
                    )}
                  >
                    <item.icon size={24} />
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Controls */}
          <div className="mt-auto pt-4 space-y-2">
            <button
              onClick={handleToggleTheme}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all",
                !isOpen && "justify-center",
              )}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              {isOpen && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
            </button>
            <button
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all",
                !isOpen && "justify-center",
              )}
            >
              <Settings size={24} />
              {isOpen && <span>Settings</span>}
            </button>
            <button
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-red-400 hover:text-red-300",
                !isOpen && "justify-center",
                showLogoutConfirm && "bg-red-500/10",
              )}
            >
              <LogOut size={24} />
              {isOpen && (
                <span>{showLogoutConfirm ? "Confirm Logout?" : "Logout"}</span>
              )}
            </button>
            {showLogoutConfirm && isOpen && (
              <div className="flex gap-2 px-3 pb-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 bg-white/5 text-foreground/60 rounded-lg text-xs font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
            {showLogoutConfirm && !isOpen && (
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded-lg text-[10px] font-bold"
              >
                Go
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
