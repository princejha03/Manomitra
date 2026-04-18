"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import * as faceapi from "face-api.js";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { analyzeFaceGravity } from "@/lib/gravityai";
import { Emotion } from "@/types";
import {
  Camera,
  RefreshCcw,
  Zap,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Brain,
  TrendingUp,
  CameraOff,
  Smile,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { mapToInternalEmotion } from "@/lib/utils";

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😔",
  angry: "😠",
  fearful: "😨",
  surprised: "😲",
  disgusted: "🤢",
  neutral: "😐",
};

export default function FaceEmotionModule() {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [gravityResults, setGravityResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<any>(null);

  const { setCurrentEmotion, addEmotionToHistory } = useStore();
  const router = useRouter();

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Use local models
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setError(
          "Could not load facial recognition models. Please check your internet connection.",
        );
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    setIsCameraOn(true);
    setIsCameraLoading(true);
    setError(null);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
    setIsCameraLoading(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const initCamera = async () => {
      if (isCameraOn && videoRef.current && !streamRef.current) {
        try {
          console.log("Requesting camera access...");
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            },
          });
          console.log("Camera access granted.");
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              setIsCameraLoading(false);
              console.log("Video playing.");
            };
          }
        } catch (err) {
          console.error("Error starting camera:", err);
          setError("Could not access camera. Please grant permission.");
          setIsCameraOn(false);
          setIsCameraLoading(false);
        }
      }
    };

    if (isCameraOn) {
      initCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    }
  }, [isCameraOn, videoRef.current]);

  const handleCapture = async () => {
    if (!videoRef.current || isAnalyzing) return;
    console.log("Capturing and analyzing face...");

    setIsAnalyzing(true);
    setError(null);
    try {
      // Ensure video is ready
      if (videoRef.current.readyState !== 4) {
        console.warn("Video not ready, state:", videoRef.current.readyState);
        throw new Error("Video is not ready. Please wait a moment.");
      }

      console.log("Detecting face expressions...");
      const detections = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }),
        )
        .withFaceExpressions();

      if (detections) {
        console.log("Face detected:", detections);
        const expressions = detections.expressions;
        const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        const dominant = sorted[0];

        console.log("Dominant emotion:", dominant[0]);

        // Capture frame for Gravity AI
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
        const base64Image = canvas.toDataURL("image/jpeg");

        console.log("Sending to Gravity AI...");
        const gravityResult = await analyzeFaceGravity(base64Image);
        console.log("Gravity AI result:", gravityResult);

        setResults(expressions);
        setGravityResults(gravityResult);

        const internalDominant = mapToInternalEmotion(dominant[0]);

        const emotionProfile = {
          dominantEmotion: internalDominant,
          intensity: Math.round(dominant[1] * 100),
          wellbeingIndex: gravityResult?.wellbeing_score || 70,
          scores: Object.entries(expressions).reduce((acc, [key, val]) => ({
            ...acc,
            [mapToInternalEmotion(key)]: val
          }), {} as any),
          timestamp: Date.now(),
        };

        setCurrentEmotion(emotionProfile);
        addEmotionToHistory(emotionProfile);
        stopCamera();
        setError(null);
      } else {
        console.warn("No face detected in video frame.");
        setError("No face detected. Please ensure your face is clearly visible and try again.");
      }
    } catch (err: any) {
      console.error("Error during capture:", err);
      setError(`An error occurred: ${err.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="flex min-h-screen" suppressHydrationWarning>
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Facial Emotion Scan</h1>
          <p className="text-foreground/60">
            Let ManoMitra read your expressions to understand your mood better.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card className="relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] bg-black">
            {!isCameraOn ? (
              <div className="text-center p-8 space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <CameraOff size={48} className="text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white">Camera is Off</h3>
                <button
                  onClick={startCamera}
                  disabled={!isModelsLoaded}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isModelsLoaded ? (
                    <>
                      <Camera size={20} /> Start Camera
                    </>
                  ) : (
                    <>
                      <Loader2 className="animate-spin" /> Loading Models...
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2 justify-center text-xs text-white/40">
                  <ShieldCheck size={14} /> No video is recorded or stored
                </div>
              </div>
            ) : (
              <>
                {isCameraLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-white font-medium">Initializing Camera...</p>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none animate-pulse" />
                {!isCameraLoading && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                      onClick={handleCapture}
                      disabled={isAnalyzing}
                      className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-2xl hover:scale-105 transition-all"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="animate-spin" /> Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap size={20} fill="currentColor" /> Capture & Analyze
                        </>
                      )}
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-6 py-4 bg-red-500/80 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-all backdrop-blur-sm"
                    >
                      <CameraOff size={20} /> Stop
                    </button>
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="absolute top-6 left-6 right-6 p-4 bg-red-500/80 text-white rounded-xl flex items-center gap-2 backdrop-blur-md">
                <AlertCircle size={20} /> {error}
              </div>
            )}
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="text-center p-8 bg-linear-to-br from-primary/10 to-secondary/10 border-white/10">
                  <div className="text-7xl mb-4">
                    {emotionEmojis[
                      Object.entries(results).sort(
                        (a: any, b: any) => b[1] - a[1],
                      )[0][0]
                    ] || "😐"}
                  </div>
                  <h3 className="text-3xl font-bold mb-2 capitalize">
                    {
                      Object.entries(results).sort(
                        (a: any, b: any) => b[1] - a[1],
                      )[0][0]
                    }
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">
                        Stress Level
                      </p>
                      <p className="text-2xl font-bold text-red-400">
                        {gravityResults?.stress_level || "Low"}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">
                        Authenticity
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        {gravityResults?.authenticity_score || "Genuine"}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h4 className="font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Facial Expression Breakdown
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(results)
                      .sort((a: any, b: any) => b[1] - a[1])
                      .map(([label, score]: any) => (
                        <div key={label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{label}</span>
                            <span className="font-bold">
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setResults(null);
                      setGravityResults(null);
                      startCamera();
                    }}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <RefreshCcw size={20} /> Retake
                  </button>
                  <button
                    onClick={() => router.push("/mood-support")}
                    className="flex-1 py-4 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2"
                  >
                    <Brain size={20} /> Get Help
                  </button>
                </div>
              </>
            ) : (
              <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10 h-full opacity-60">
                <Smile size={64} className="text-foreground/20 mb-4" />
                <h3 className="text-xl font-bold text-foreground/40">
                  Ready to Scan
                </h3>
                <p className="text-sm text-foreground/40 max-w-xs mt-2">
                  Start your camera and capture a photo. ManoMitra will analyze
                  your micro-expressions.
                </p>
              </Card>
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
