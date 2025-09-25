import { Loader2, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Analyzing your leaf..." }: LoadingStateProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-medium animate-scale-in">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center animate-pulse-soft">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <Loader2 className="absolute inset-0 w-20 h-20 mx-auto text-primary animate-spin" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Checking Leaf Health
            </h3>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Our AI is examining your leaf for:
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 opacity-70">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Disease patterns</span>
              </div>
              <div className="flex items-center gap-2 opacity-70">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100" />
                <span>Leaf condition</span>
              </div>
              <div className="flex items-center gap-2 opacity-70">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200" />
                <span>Health assessment</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};