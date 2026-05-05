import Card from "@/components/ui/Card";
import { BarChart3, Database, BookOpen, Zap } from "lucide-react";

export default function VoiceDatasetInfo() {
  const datasets = [
    {
      name: "RAVDESS",
      samples: 1440,
      actors: 24,
      emotions: "7",
      description: "Ryerson Audio-Visual Emotion Database and Speech Dataset",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      name: "TESS",
      samples: 2800,
      actors: 4,
      emotions: "7",
      description: "Toronto Emotional Speech Set",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
  ];

  const features = [
    { name: "MFCC", count: 40, desc: "Mel Frequency Cepstral Coefficients" },
    { name: "Chroma", count: 12, desc: "Pitch class intensity" },
    {
      name: "Mel Spectrogram",
      count: 128,
      desc: "Frequency energy distribution",
    },
  ];

  const emotions = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Neutral",
    "Sad",
    "Surprise",
  ];

  return (
    <div className="space-y-6">
      {/* Datasets Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database size={24} className="text-primary" />
          Training Datasets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasets.map((dataset) => (
            <Card
              key={dataset.name}
              className={`bg-linear-to-br ${dataset.color} border ${dataset.borderColor}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold">{dataset.name}</h4>
                  <p className="text-xs text-foreground/60">
                    {dataset.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-white/10 rounded">
                  <p className="text-foreground/60 text-xs mb-1">Samples</p>
                  <p className="font-bold">
                    {dataset.samples.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-white/10 rounded">
                  <p className="text-foreground/60 text-xs mb-1">Actors</p>
                  <p className="font-bold">{dataset.actors}</p>
                </div>
                <div className="p-2 bg-white/10 rounded">
                  <p className="text-foreground/60 text-xs mb-1">Emotions</p>
                  <p className="font-bold">{dataset.emotions}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="text-xs text-foreground/50 mt-3">
          <span className="font-semibold">Total Training Samples:</span> 4,240+
          recordings across multiple speakers and environments
        </p>
      </div>

      {/* Features Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap size={24} className="text-secondary" />
          Audio Features (180-dimensional)
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature) => (
            <Card
              key={feature.name}
              className="bg-white/5 border-white/10 p-4 text-center"
            >
              <p className="text-2xl font-bold text-secondary mb-1">
                {feature.count}
              </p>
              <p className="font-bold text-sm mb-1">{feature.name}</p>
              <p className="text-xs text-foreground/60">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Emotions Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 size={24} className="text-primary" />
          Detected Emotions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {emotions.map((emotion) => (
            <div
              key={emotion}
              className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              {emotion}
            </div>
          ))}
        </div>
      </div>

      {/* Model Info */}
      <Card className="bg-linear-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 p-4">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <BookOpen size={18} /> Model Architecture
        </h4>
        <p className="text-sm text-foreground/70 mb-3">
          1D Convolutional Neural Network with batch normalization and residual
          connections
        </p>
        <div className="text-xs text-foreground/60 space-y-1 font-mono">
          <p>• Input: 180-dimensional feature vector</p>
          <p>• Conv1D layers: 256 → 128 → 64 channels</p>
          <p>• Activation: ReLU with MaxPooling</p>
          <p>• Output: 7 emotion classes (softmax)</p>
          <p>• Expected Accuracy: ~80-85%</p>
        </div>
      </Card>
    </div>
  );
}
