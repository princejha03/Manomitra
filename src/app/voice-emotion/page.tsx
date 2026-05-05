"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import VoiceDatasetInfo from "@/components/emotion/VoiceDatasetInfo";
import { useStore } from "@/store/useStore";
import { analyzeVoiceGravity } from "@/lib/gravityai";
import {
  Mic,
  Square,
  RefreshCcw,
  Zap,
  Loader2,
  AlertCircle,
  Brain,
  TrendingUp,
  Volume2,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import VoiceRecorder from "@/components/emotion/VoiceRecorder";
import {
  mapToInternalEmotion,
  analyzeTranscript,
  getTranscriptInsights,
} from "@/lib/utils";

export default function VoiceEmotionModule() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [gravityResults, setGravityResults] = useState<any>(null);
  const [transcription, setTranscription] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timer, setTimer] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFeatures, setAudioFeatures] = useState<any>(null);
  const [sessionRating, setSessionRating] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null,
  );
  const [showDatasetInfo, setShowDatasetInfo] = useState(false);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const countdownRef = useRef<number | null>(null);
  const { setCurrentEmotion, addEmotionToHistory, addActivityLog } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && !recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscription((prev) => prev + transcript + " ");
          } else {
            interim += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === "aborted") {
          console.warn("Speech recognition aborted");
          return;
        }
        console.error("Speech recognition error:", event.error);
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          setError(
            "Microphone access was denied. Please allow the browser to use your microphone.",
          );
        } else if (event.error !== "no-speech") {
          setError(
            "Speech recognition stopped unexpectedly. You can still use voice recording.",
          );
        }
      };

      recognitionRef.current.onend = () => {
        if (isRecording && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.warn("Could not restart speech recognition:", err);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current && isRecording) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.warn("Error aborting speech recognition:", err);
        }
      }
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.warn("Error cleaning up speech recognition:", err);
        }
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const getAudioFeatures = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      const channelData =
        decoded.numberOfChannels > 0
          ? decoded.getChannelData(0)
          : new Float32Array();

      const sumSquares = channelData.reduce(
        (sum, sample) => sum + sample * sample,
        0,
      );
      const rms =
        channelData.length > 0 ? Math.sqrt(sumSquares / channelData.length) : 0;
      const maxAmp =
        channelData.length > 0 ? Math.max(...channelData.map(Math.abs)) : 0;
      const zeroCrossings = channelData.reduce((count, sample, index) => {
        if (index === 0) return 0;
        return count + (sample >= 0 !== channelData[index - 1] >= 0 ? 1 : 0);
      }, 0);
      const pitchEstimate =
        decoded.duration > 0
          ? Math.round(zeroCrossings / decoded.duration / 2)
          : 0;
      const speechRate =
        transcription.trim().length > 0
          ? Math.round(
              (transcription.trim().split(/\s+/).length /
                Math.max(decoded.duration, 1)) *
                60,
            )
          : 0;

      audioContext.close();

      return {
        duration: decoded.duration,
        sampleRate: decoded.sampleRate,
        rms,
        maxAmp,
        pitch: pitchEstimate,
        speechRate,
        volume: Math.min(100, Math.round(rms * 200)),
        transcription: transcription.trim(),
      };
    } catch (err) {
      console.error("Audio feature extraction failed:", err);
      return {
        duration: 10,
        sampleRate: 44100,
        rms: 0,
        maxAmp: 0,
        pitch: 0,
        speechRate: 0,
        volume: 45,
        transcription: transcription.trim(),
      };
    }
  };

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(audioStream);
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      setTimer(10);
      setTranscription("");
      setAudioBlob(null);
      setAudioFeatures(null);
      setResults(null);
      setGravityResults(null);
      setError(null);
      setSessionRating(0);
      audioChunksRef.current = [];

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      const recorder = new MediaRecorder(audioStream);
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const features = await getAudioFeatures(blob);
        setAudioFeatures(features);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      countdownRef.current = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please grant permission.");
    }
  };

  const stopRecording = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.warn("Speech recognition abort error:", err);
      }
    }
    setIsRecording(false);
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    if (!audioBlob && !transcription.trim()) {
      setError("Record your voice first to get emotion insights.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const features = audioFeatures || {
        transcription: transcription.trim(),
        duration: 10,
      };

      const gravityResult = await analyzeVoiceGravity(features);

      const resultTone = gravityResult?.dominant_emotion || "Calm";
      const resultEnergy =
        gravityResult?.energy_level ??
        Math.round((features.volume || 50) * 0.8);

      setResults({
        tone: resultTone,
        confidence: gravityResult?.confidence || 0.85,
        energy: resultEnergy,
      });
      setGravityResults(gravityResult);

      const internalDominant = mapToInternalEmotion(resultTone);
      const scores = {
        calm: 0.7,
        happy: 0.1,
        neutral: 0.2,
      } as any;

      if (
        resultTone.toLowerCase().includes("angry") ||
        resultTone.toLowerCase().includes("stress")
      ) {
        scores.calm = 0.2;
        scores.angry = 0.5;
      }
      if (
        resultTone.toLowerCase().includes("happy") ||
        resultTone.toLowerCase().includes("joy")
      ) {
        scores.happy = 0.6;
        scores.calm = 0.3;
      }

      const emotionProfile = {
        dominantEmotion: internalDominant,
        intensity: gravityResult?.energy_level ?? resultEnergy,
        wellbeingIndex: gravityResult?.wellbeing_index ?? 75,
        scores,
        timestamp: Date.now(),
      };

      setCurrentEmotion(emotionProfile);
      addEmotionToHistory(emotionProfile);
    } catch (err) {
      console.error("Error during voice analysis:", err);
      setError("An error occurred during voice analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const logVoiceActivity = () => {
    if (!sessionRating || !recordingStartTime) return;

    addActivityLog({
      activityType: "voice-emotion",
      activityName: "Voice Emotion Analysis",
      duration: 10,
      rating: sessionRating,
      mood: currentEmotion?.dominantEmotion,
      feedback: transcription || "Voice recording analyzed",
      startTime: recordingStartTime,
      endTime: Date.now(),
    });

    setError("Activity logged successfully! 🎉");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Voice Emotion Analysis</h1>
          <p className="text-foreground/60">
            Speak freely for 10 seconds. Your tone carries your emotions.
          </p>
          <div className="mt-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-sm text-foreground/70">
              <span className="font-semibold">📊 Model trained on:</span>{" "}
              RAVDESS (1,440 samples) + TESS (2,800 samples) datasets with
              180-dimensional audio features
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Section */}
          <Card className="flex flex-col items-center justify-center p-12 text-center min-h-125">
            <div className="mb-8 space-y-4">
              <h3 className="text-xl font-bold">
                "How was your day? Tell us anything."
              </h3>
              <p className="text-sm text-foreground/40 max-w-xs mx-auto">
                Count to 10 or just speak naturally. Your voice is a reflection
                of your soul.
              </p>
            </div>

            <div className="relative mb-12">
              <div
                className={`absolute -inset-8 bg-primary/20 rounded-full blur-2xl transition-all duration-500 ${isRecording ? "scale-150 opacity-100" : "scale-100 opacity-0"}`}
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${isRecording ? "bg-red-500 animate-pulse" : "bg-primary hover:scale-105"}`}
              >
                {isRecording ? (
                  <Square size={32} fill="white" />
                ) : (
                  <Mic size={32} />
                )}
              </button>
            </div>

            {isRecording && (
              <div className="w-full space-y-4">
                <VoiceRecorder stream={stream} isRecording={isRecording} />
                <div className="text-3xl font-bold text-red-500">{timer}s</div>
              </div>
            )}

            {!isRecording && (transcription || audioBlob) && (
              <div className="w-full mt-6 space-y-6">
                {transcription ? (
                  <div className="space-y-4">
                    <Card className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-left p-6">
                      <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold mb-3">
                        <FileText size={16} /> LIVE TRANSCRIPT
                      </div>
                      <p className="text-base leading-relaxed italic text-foreground/90">
                        "{transcription.trim()}"
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/10 flex gap-6 text-xs">
                        <div>
                          <p className="text-foreground/50">Word Count</p>
                          <p className="font-bold text-foreground">
                            {transcription.trim().split(/\s+/).length}
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground/50">Character Length</p>
                          <p className="font-bold text-foreground">
                            {transcription.trim().length}
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground/50">Speaking Rate</p>
                          <p className="font-bold text-foreground">
                            {audioFeatures?.speechRate || 120} wpm
                          </p>
                        </div>
                      </div>
                    </Card>

                    {audioFeatures && (
                      <Card className="bg-white/5 border-white/10 text-left p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp size={14} className="text-primary" />{" "}
                          Audio Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2 bg-white/5 rounded">
                            <p className="text-foreground/50 mb-1">Duration</p>
                            <p className="font-bold">
                              {audioFeatures.duration.toFixed(1)}s
                            </p>
                          </div>
                          <div className="p-2 bg-white/5 rounded">
                            <p className="text-foreground/50 mb-1">Volume</p>
                            <p className="font-bold">{audioFeatures.volume}%</p>
                          </div>
                          <div className="p-2 bg-white/5 rounded">
                            <p className="text-foreground/50 mb-1">
                              Pitch Est.
                            </p>
                            <p className="font-bold">
                              {audioFeatures.pitch} Hz
                            </p>
                          </div>
                          <div className="p-2 bg-white/5 rounded">
                            <p className="text-foreground/50 mb-1">
                              Sample Rate
                            </p>
                            <p className="font-bold">
                              {(audioFeatures.sampleRate / 1000).toFixed(0)}kHz
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="bg-white/5 border-white/10 text-left p-4">
                    <div className="text-sm font-medium text-foreground/50 mb-2">
                      🔊 Audio Captured
                    </div>
                    <p className="text-sm text-foreground/60">
                      Your voice recording is ready for analysis. Speech
                      transcription may not be supported in this browser. The
                      emotion analysis will still work based on acoustic
                      features.
                    </p>
                  </Card>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap size={20} fill="currentColor" /> Analyze Voice
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setTranscription("");
                      setResults(null);
                      setAudioBlob(null);
                      setAudioFeatures(null);
                    }}
                    className="p-4 bg-white/5 text-foreground/40 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <RefreshCcw size={20} />
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 text-red-400 rounded-xl flex items-center gap-2">
                <AlertCircle size={20} /> {error}
              </div>
            )}
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="text-center p-8 bg-linear-to-br from-primary/10 to-secondary/10 border-white/10">
                  <div className="p-4 bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Volume2 size={40} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 capitalize">
                    {results.tone} Tone
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">
                        Energy Level
                      </p>
                      <p className="text-2xl font-bold text-secondary">
                        {results.energy}%
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">
                        Stress Score
                      </p>
                      <p className="text-2xl font-bold text-red-400">
                        {gravityResults?.stress_score || 25}%
                      </p>
                    </div>
                  </div>
                </Card>

                {transcription && (
                  <Card className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-cyan-400" />
                      Transcript Analysis
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-foreground/50 mb-1">
                          Your words:
                        </p>
                        <p className="text-sm italic text-foreground/80">
                          "{transcription.trim()}"
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 bg-white/5 rounded text-center">
                          <p className="text-foreground/50">Words</p>
                          <p className="font-bold text-cyan-300">
                            {transcription.trim().split(/\s+/).length}
                          </p>
                        </div>
                        <div className="p-2 bg-white/5 rounded text-center">
                          <p className="text-foreground/50">Chars</p>
                          <p className="font-bold text-cyan-300">
                            {transcription.trim().length}
                          </p>
                        </div>
                        <div className="p-2 bg-white/5 rounded text-center">
                          <p className="text-foreground/50">Rate</p>
                          <p className="font-bold text-cyan-300">
                            {audioFeatures?.speechRate || 120} wpm
                          </p>
                        </div>
                      </div>
                      {audioFeatures && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs font-semibold text-cyan-300 mb-2">
                            💡 Insights:
                          </p>
                          <div className="space-y-1">
                            {getTranscriptInsights(
                              analyzeTranscript(
                                transcription.trim(),
                                audioFeatures.duration,
                              ),
                            ).map((insight, idx) => (
                              <p
                                key={idx}
                                className="text-xs text-foreground/70"
                              >
                                {insight}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                <Card>
                  <h4 className="font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Vocal Patterns
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gravityResults?.vocal_patterns
                      ? gravityResults.vocal_patterns.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      : ["Steady", "Calm", "Warm", "Melodic"].map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                  </div>
                </Card>

                <Card className="bg-white/5 border-white/10 p-4 text-xs">
                  <p className="text-foreground/60 mb-2">
                    <span className="font-semibold">📊 Model Info:</span> This
                    analysis uses a CNN trained on RAVDESS (1,440) and TESS
                    (2,800) datasets, extracting MFCC, Chroma, and
                    Mel-spectrogram features for comprehensive emotion
                    detection.
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10">
                  <h4 className="font-bold mb-4">Rate this session</h4>
                  <div className="flex gap-2 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSessionRating(rating)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          sessionRating === rating
                            ? "bg-primary text-white"
                            : "bg-white/5 text-foreground/60 hover:bg-white/10"
                        }`}
                      >
                        {rating} ⭐
                      </button>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-4">
                  <button
                    onClick={logVoiceActivity}
                    disabled={!sessionRating}
                    className="flex-1 py-4 bg-secondary text-white rounded-xl font-bold text-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2"
                  >
                    <Zap size={20} fill="currentColor" /> Log & Continue
                  </button>
                  <button
                    onClick={() => router.push("/mood-support")}
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Brain size={20} /> Support Options
                  </button>
                </div>
              </>
            ) : (
              <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10 h-full opacity-60">
                <Volume2 size={64} className="text-foreground/20 mb-4" />
                <h3 className="text-xl font-bold text-foreground/40">
                  Voice Analysis Results
                </h3>
                <p className="text-sm text-foreground/40 max-w-xs mt-2">
                  ManoMitra will analyze your tone, pitch, and energy once you
                  record your voice.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Dataset Information Section */}
        <div className="mt-16">
          <button
            onClick={() => setShowDatasetInfo(!showDatasetInfo)}
            className="w-full flex items-center justify-between p-6 bg-linear-to-r from-primary/10 to-secondary/10 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <h2 className="text-2xl font-bold flex items-center gap-3">
              📊 Model & Dataset Information
            </h2>
            <ChevronDown
              size={24}
              className={`transition-transform ${
                showDatasetInfo ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDatasetInfo && (
            <div className="mt-6">
              <VoiceDatasetInfo />
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}
