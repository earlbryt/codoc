import { useState, useCallback } from "react";
import { Upload, Image, AlertCircle } from "lucide-react";
import { AgriculturalButton } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUpload = ({ onImageSelect, isLoading = false }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  }, []);

  const handleImageFile = useCallback((file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Pass file to parent
    onImageSelect(file);
  }, [onImageSelect]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-medium animate-fade-in">
      <CardContent className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-muted-foreground/30 hover:border-primary/50'
          } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
            id="image-upload"
          />
          
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden shadow-soft">
                <img
                  src={selectedImage}
                  alt="Selected leaf"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-success">
                <Image className="w-5 h-5" />
                <span className="text-sm font-medium">Image selected successfully</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Upload Leaf Image
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to select a photo of your cocoa leaf
                </p>
              </div>
              <AgriculturalButton
                variant="upload"
                size="lg"
                className="w-full"
                disabled={isLoading}
                type="button"
              >
                Choose Image
              </AgriculturalButton>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            For best results, use clear photos of individual cocoa leaves with good lighting. 
            Supported formats: JPG, PNG, WEBP
          </p>
        </div>
      </CardContent>
    </Card>
  );
};