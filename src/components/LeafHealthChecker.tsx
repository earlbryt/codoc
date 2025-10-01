import { useState } from "react";
import { CameraCapture } from "./CameraCapture";
import { ImageUpload } from "./ImageUpload";
import { LoadingState } from "./LoadingState";
import { ResultDisplay } from "./ResultDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Heart, Camera, Upload } from "lucide-react";
import farmer1 from "@/assets/farmer1.png";
import farmer2 from "@/assets/farmer2.png";
import { API_BASE_URL } from "@/config";

// Backend-powered predictions
const API_ENDPOINT = `${API_BASE_URL}/predict`;

type AppState = 'camera' | 'loading' | 'result';

export const LeafHealthChecker = () => {
  const [appState, setAppState] = useState<AppState>('camera');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [captureMode, setCaptureMode] = useState<"camera" | "upload">("camera");

const handleImageCapture = (imageData: string) => {
  setSelectedImage(imageData);
  setAppState('loading');

  (async () => {
    try {
      // Convert data URL to Blob
      const resp = await fetch(imageData);
      const blob = await resp.blob();
      await processImage(blob);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('Prediction failed. Please ensure the backend is running and try again.');
      setAppState('camera');
    }
  })();
};

const handleImageSelect = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    setSelectedImage(e.target?.result as string);
  };
  reader.readAsDataURL(file);
  setAppState('loading');

  (async () => {
    try {
      await processImage(file);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('Prediction failed. Please ensure the backend is running and try again.');
      setAppState('camera');
    }
  })();
};

const processImage = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('file', blob, 'leaf.jpg');

  const res = await fetch(API_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();
  setResult(data);
  setAppState('result');
};

  const handleNewScan = () => {
    setAppState('camera');
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">      
      {/* Main Content */}
      <main className="px-3 sm:px-4 py-4 sm:py-6">
        {appState === 'camera' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-8">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary flex items-center justify-center">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Cocoa Leaf Health
                </h1>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-2">
                Capture a photo or upload an image of your cocoa leaf for instant health analysis
              </p>
            </div>
            
            <Tabs value={captureMode} onValueChange={(v) => setCaptureMode(v as "camera" | "upload")} className="w-full max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="camera" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Take Photo
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="camera">
                <CameraCapture onImageCapture={handleImageCapture} />
              </TabsContent>
              <TabsContent value="upload">
                <ImageUpload onImageSelect={handleImageSelect} />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {appState === 'loading' && (
          <div className="max-w-md mx-auto mt-16 sm:mt-32">
            <LoadingState message="Our AI is analyzing your leaf for diseases and health indicators..." />
          </div>
        )}
        
        {appState === 'result' && result && (
          <div className="max-w-4xl mx-auto">
            <ResultDisplay 
              result={result} 
              onNewScan={handleNewScan}
              imagePreview={selectedImage || undefined}
            />
          </div>
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