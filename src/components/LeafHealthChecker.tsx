import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { LoadingState } from "./LoadingState";
import { ResultDisplay } from "./ResultDisplay";
import { Leaf, Heart } from "lucide-react";
import farmer1 from "@/assets/farmer1.png";
import farmer2 from "@/assets/farmer2.png";

// Mock prediction results for demo
const mockPredictions = [
  {
    className: "Healthy Leaf",
    confidence: 0.94,
    isHealthy: true,
    recommendations: [
      "Continue current care routine",
      "Monitor for any changes",
      "Ensure proper watering and sunlight"
    ]
  },
  {
    className: "Black Pod Disease",
    confidence: 0.87,
    isHealthy: false,
    recommendations: [
      "Remove affected pods immediately",
      "Improve drainage around plants",
      "Apply copper-based fungicide",
      "Increase air circulation"
    ]
  },
  {
    className: "Witches' Broom",
    confidence: 0.76,
    isHealthy: false,
    recommendations: [
      "Prune infected branches",
      "Destroy pruned material",
      "Apply protective fungicide",
      "Monitor regularly for new growth"
    ]
  }
];

type AppState = 'upload' | 'loading' | 'result';

export const LeafHealthChecker = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleImageSelect = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate API call
    setAppState('loading');
    
    setTimeout(() => {
      // Random mock result
      const randomResult = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      setResult(randomResult);
      setAppState('result');
    }, 3000);
  };

  const handleNewScan = () => {
    setAppState('upload');
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Cocoa Leaf Health
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Upload a photo of your cocoa leaf to instantly check for diseases and get expert recommendations
        </p>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        {appState === 'upload' && (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}
        
        {appState === 'loading' && (
          <LoadingState message="Our AI is analyzing your leaf for diseases and health indicators..." />
        )}
        
        {appState === 'result' && result && (
          <ResultDisplay 
            result={result} 
            onNewScan={handleNewScan}
            imagePreview={selectedImage || undefined}
          />
        )}
      </main>

      {/* Farmer Illustrations */}
      <div className="fixed bottom-4 left-4 hidden lg:block opacity-20 hover:opacity-100 transition-opacity">
        <img 
          src={farmer1} 
          alt="Farmer illustration" 
          className="w-24 h-24 object-contain"
        />
      </div>
      <div className="fixed bottom-4 right-4 hidden lg:block opacity-20 hover:opacity-100 transition-opacity">
        <img 
          src={farmer2} 
          alt="Farmer with phone illustration" 
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Footer */}
      <footer className="text-center py-6 px-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-destructive" />
          <span>for farmers worldwide</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          AI-powered leaf disease detection for healthier crops
        </p>
      </footer>
    </div>
  );
};