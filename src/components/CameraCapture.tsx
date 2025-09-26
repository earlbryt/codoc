import { useState, useRef, useEffect } from "react";
import { Camera, RotateCcw, Zap } from "lucide-react";
import { AgriculturalButton } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
}

export const CameraCapture = ({ onImageCapture }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const processImage = () => {
    if (capturedImage) {
      onImageCapture(capturedImage);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  if (hasPermission === false) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-8 text-center">
        <div className="space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Camera Access Required
            </h3>
            <p className="text-muted-foreground">
              Please allow camera access to take photos of your cocoa leaves
            </p>
          </div>
          <AgriculturalButton onClick={startCamera} variant="primary" size="lg">
            Enable Camera
          </AgriculturalButton>
        </div>
      </Card>
    );
  }

  if (hasPermission === null) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Accessing camera...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black md:relative md:w-full md:space-y-4 md:bg-transparent">
      {/* Full Screen Camera View */}
      <div className="relative w-full h-full md:max-w-6xl md:mx-auto">
        {/* Camera/Image Display */}
        <div className="relative w-full h-full md:aspect-video md:rounded-2xl md:overflow-hidden md:shadow-elegant">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured leaf"
              className="w-full h-full object-cover md:rounded-2xl"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              controls={false}
              disablePictureInPicture
              webkit-playsinline="true"
              className="w-full h-full object-cover md:rounded-2xl"
              style={{ objectFit: 'cover' }}
            />
          )}
          
          {/* Camera overlay - only show on mobile when not captured */}
          {!capturedImage && (
            <div className="absolute inset-0 pointer-events-none md:hidden">
              <div className="absolute inset-6 border-2 border-white/30 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-white text-center space-y-2">
                  <Camera className="w-8 h-8 mx-auto opacity-70" />
                  <p className="text-sm opacity-70 px-4">Position leaf in frame</p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop overlay */}
          {!capturedImage && (
            <div className="absolute inset-0 pointer-events-none hidden md:block">
              <div className="absolute inset-4 border-2 border-white/30 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-white text-center space-y-2">
                  <Camera className="w-8 h-8 mx-auto opacity-70" />
                  <p className="text-sm opacity-70 px-4">Position leaf in frame</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Bottom Controls - Camera App Style */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pb-8 md:hidden">
            {capturedImage ? (
              <div className="flex justify-center gap-4">
                <AgriculturalButton
                  onClick={retakePhoto}
                  variant="outline"
                  size="lg"
                  className="flex-1 max-w-32 h-14 text-base touch-manipulation border-white/30 text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </AgriculturalButton>
                <AgriculturalButton
                  onClick={processImage}
                  variant="primary"
                  size="lg"
                  className="flex-1 max-w-40 h-14 text-base touch-manipulation"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Leaf
                </AgriculturalButton>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-8">
                {/* Camera Switch Button */}
                <button
                  onClick={switchCamera}
                  className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors touch-manipulation border-2 border-white/20"
                >
                  <RotateCcw className="w-7 h-7" />
                </button>

                {/* Capture Button */}
                <div className="relative">
                  <AgriculturalButton
                    onClick={captureImage}
                    variant="capture"
                    size="xl"
                    className="w-20 h-20 rounded-full p-0 touch-manipulation border-4 border-white/30"
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary"></div>
                    </div>
                  </AgriculturalButton>
                </div>

                {/* Spacer to balance layout */}
                <div className="w-16 h-16"></div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex justify-center items-center gap-4 mt-6 pb-8">
          {capturedImage ? (
            <div className="flex gap-4">
              <AgriculturalButton
                onClick={retakePhoto}
                variant="outline"
                size="lg"
                className="px-8 h-14 text-base"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Photo
              </AgriculturalButton>
              <AgriculturalButton
                onClick={processImage}
                variant="primary"
                size="lg"
                className="px-8 h-14 text-base"
              >
                <Zap className="w-5 h-5 mr-2" />
                Check Leaf Health
              </AgriculturalButton>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <button
                onClick={switchCamera}
                className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              
              <div className="relative">
                <AgriculturalButton
                  onClick={captureImage}
                  variant="capture"
                  size="xl"
                  className="w-20 h-20 rounded-full p-0"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary"></div>
                  </div>
                </AgriculturalButton>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground text-sm text-center whitespace-nowrap">
                  Tap to capture
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};