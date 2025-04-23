
import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import FileUpload from "@/components/FileUpload";
import CommandInput from "@/components/CommandInput";
import CommandResult from "@/components/CommandResult";
import FileInfo from "@/components/FileInfo";

const Index = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<Array<any>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);



  const handleFileUploaded = (newSessionId: string, newFileName: string) => {
    setSessionId(newSessionId);
    setFileName(newFileName);
    // Clear previous results when a new file is uploaded
    setResults([]);
  };

  const handleCommandExecuted = (result: any) => {
    setResults((prev) => [...prev, result]);
  };

  const handleClearResults = () => {
    setResults([]);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">1. Upload Your File</h2>
          <FileUpload 
            onFileUploaded={handleFileUploaded} 
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
          
          {fileName && (
            <FileInfo fileName={fileName} />
          )}
          
          <h2 className="text-xl font-semibold">2. Execute Commands</h2>
          <CommandInput 
            sessionId={sessionId}
            onCommandExecuted={handleCommandExecuted}
            onClearResults={handleClearResults}
            isExecuting={isExecuting}
            setIsExecuting={setIsExecuting}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">3. View Results</h2>
          <CommandResult results={results} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
