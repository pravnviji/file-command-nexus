
import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileUploaded: (sessionId: string, fileName: string) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

const FileUpload = ({ onFileUploaded, isUploading, setIsUploading }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "File Uploaded",
          description: `${file.name} was successfully uploaded.`,
        });
        onFileUploaded(data.session_id, data.filename);
      } else {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: data.error || "An error occurred during upload.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not connect to the server.",
      });
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={`relative border-2 border-dashed ${dragActive ? 'border-primary' : 'border-gray-300'}`}>
      <CardContent className="p-6">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />
        
        <div
          className="flex flex-col items-center justify-center space-y-4 py-8"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="rounded-full bg-muted p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">Drag and drop your file here</p>
            <p className="text-sm text-muted-foreground">or</p>
          </div>
          
          <Button 
            onClick={handleButtonClick}
            disabled={isUploading}
            className="relative"
          >
            <span>Select File</span>
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Upload any file to process with commands
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
