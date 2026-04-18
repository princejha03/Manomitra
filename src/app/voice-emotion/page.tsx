"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
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
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import VoiceRecorder from "@/components/emotion/VoiceRecorder";
import { mapToInternalEmotion } from "@/lib/utils";

export default function VoiceEmotionModule() {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [gravityResults, setGravityResults] = useState<any>(null);
  const [transcription, setTranscription] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timer, setTimer] = useState(10);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const { setCurrentEmotion, addEmotionToHistory } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "speechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscription((prev) => prev + event.results[i][0].transcript + " ");
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      setIsRecording(true);
      setTimer(10);
      setTranscription("");
      setError(null);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
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
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleAnalyze = async () => {
    if (!transcription || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      // Basic audio features (mocked for demo)
      const features = {
        pitch: 180,
        energy: 45,
        rate: 3.5,
        pauses: 2,
        variation: 15,
        transcription: transcription.trim(),
        duration: 10
      };

      const gravityResult = await analyzeVoiceGravity(features);
      
      setResults({
        tone: gravityResult?.dominant_emotion || "Calm",
        confidence: gravityResult?.confidence || 0.85,
        energy: gravityResult?.energy_level || 60
      });
      setGravityResults(gravityResult);

      const internalDominant = mapToInternalEmotion(gravityResult?.dominant_emotion || "calm");

      const emotionProfile = {
        dominantEmotion: internalDominant,
        intensity: gravityResult?.energy_level || 60,
        wellbeingIndex: gravityResult?.wellbeing_index || 75,
        scores: { calm: 0.8, happy: 0.1, neutral: 0.1 } as any,
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Voice Emotion Analysis</h1>
          <p className="text-foreground/60">Speak freely for 10 seconds. Your tone carries your emotions.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recording Section */}
          <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
            <div className="mb-8 space-y-4">
              <h3 className="text-xl font-bold">"How was your day? Tell us anything."</h3>
              <p className="text-sm text-foreground/40 max-w-xs mx-auto">
                Count to 10 or just speak naturally. Your voice is a reflection of your soul.
              </p>
            </div>

            <div className="relative mb-12">
              <div className={`absolute -inset-8 bg-primary/20 rounded-full blur-2xl transition-all duration-500 ${isRecording ? "scale-150 opacity-100" : "scale-100 opacity-0"}`} />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${isRecording ? "bg-red-500 animate-pulse" : "bg-primary hover:scale-105"}`}
              >
                {isRecording ? <Square size={32} fill="white" /> : <Mic size={32} />}
              </button>
            </div>

            {isRecording && (
              <div className="w-full space-y-4">
                <VoiceRecorder stream={stream} isRecording={isRecording} />
                <div className="text-3xl font-bold text-red-500">{timer}s</div>
              </div>
            )}

            {!isRecording && transcription && (
              <div className="w-full mt-6 space-y-6">
                <Card className="bg-white/5 border-white/10 text-left p-4">
                  <div className="flex items-center gap-2 text-xs text-foreground/40 mb-2">
                    <FileText size={14} /> Transcription
                  </div>
                  <p className="text-sm italic">"{transcription.trim()}"</p>
                </Card>
                <div className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="animate-spin" /> Analyzing...</>
                    ) : (
                      <><Zap size={20} fill="currentColor" /> Analyze Voice</>
                    )}
                  </button>
                  <button
                    onClick={() => { setTranscription(""); setResults(null); }}
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
                <Card className="text-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-white/10">
                  <div className="p-4 bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Volume2 size={40} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 capitalize">
                    {results.tone} Tone
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">Energy Level</p>
                      <p className="text-2xl font-bold text-secondary">
                        {results.energy}%
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-sm text-foreground/40 mb-1">Stress Score</p>
                      <p className="text-2xl font-bold text-red-400">
                        {gravityResults?.stress_score || 25}%
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h4 className="font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Vocal Patterns
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gravityResults?.vocal_patterns ? (
                      gravityResults.vocal_patterns.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))
                    ) : (
                      ["Steady", "Calm", "Warm", "Melodic"].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))
                    )}
                  </div>
                </Card>

                <button
                  onClick={() => router.push("/mood-support")}
                  className="w-full py-4 bg-secondary text-white rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2"
                >
                  <Brain size={20} /> View Support Options
                </button>
              </>
            ) : (
              <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10 h-full opacity-60">
                <Volume2 size={64} className="text-foreground/20 mb-4" />
                <h3 className="text-xl font-bold text-foreground/40">Voice Analysis Results</h3>
                <p className="text-sm text-foreground/40 max-w-xs mt-2">
                  ManoMitra will analyze your tone, pitch, and energy once you record your voice.
                </p>
              </Card>
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
