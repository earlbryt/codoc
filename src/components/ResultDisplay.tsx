import { CheckCircle, AlertTriangle, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgriculturalButton } from "@/components/ui/button-variants";

interface PredictionResult {
  className: string;
  confidence: number;
  isHealthy: boolean;
  recommendations?: string[];
}

interface ResultDisplayProps {
  result: PredictionResult;
  onNewScan: () => void;
  imagePreview?: string;
}

export const ResultDisplay = ({ result, onNewScan, imagePreview }: ResultDisplayProps) => {
  const { className, confidence, isHealthy, recommendations } = result;
  
  const getResultIcon = () => {
    if (isHealthy) return <CheckCircle className="w-8 h-8 text-success" />;
    if (confidence > 0.7) return <XCircle className="w-8 h-8 text-destructive" />;
    return <AlertTriangle className="w-8 h-8 text-warning" />;
  };

  const getResultColor = () => {
    if (isHealthy) return "text-success";
    if (confidence > 0.7) return "text-destructive";
    return "text-warning";
  };

  const getStatusMessage = () => {
    if (isHealthy) return "Your leaf appears healthy! 🌱";
    if (confidence > 0.7) return `Disease detected: ${className}`;
    return `Possible issue detected: ${className}`;
  };

  const getAdviceMessage = () => {
    if (isHealthy) return "Keep up the good care! Your cocoa plant is thriving.";
    if (confidence > 0.7) return "We recommend taking action to treat this condition.";
    return "Monitor your plant closely and consider consulting an expert.";
  };

  return (
    <Card className="w-full max-w-md sm:max-w-lg mx-auto shadow-medium animate-slide-up">
      <CardHeader className="text-center pb-4 px-4 sm:px-6">
        <div className="flex justify-center mb-3">
          {getResultIcon()}
        </div>
        <CardTitle className={`text-lg sm:text-xl ${getResultColor()}`}>
          {getStatusMessage()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {imagePreview && (
          <div className="relative rounded-lg overflow-hidden shadow-soft">
            <img
              src={imagePreview}
              alt="Analyzed leaf"
              className="w-full h-40 sm:h-32 object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Analyzed
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Confidence Level</div>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(confidence * 100)}%
            </div>
            <div className="w-full bg-muted rounded-full h-3 sm:h-2 mt-2">
              <div 
                className={`h-3 sm:h-2 rounded-full transition-all duration-500 ${
                  isHealthy ? 'bg-success' : 
                  confidence > 0.7 ? 'bg-destructive' : 'bg-warning'
                }`}
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              {getAdviceMessage()}
            </p>
          </div>

          {recommendations && recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Recommendations:</h4>
              <ul className="text-sm sm:text-xs text-muted-foreground space-y-2 sm:space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <AgriculturalButton
            variant="primary"
            size="lg"
            className="w-full h-12 sm:h-auto text-base touch-manipulation"
            onClick={onNewScan}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Scan Another Leaf
          </AgriculturalButton>
          
          <p className="text-xs text-muted-foreground text-center px-2">
            For serious plant health concerns, please consult with a local agricultural expert.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};