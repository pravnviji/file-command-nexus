
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";

interface CommandResultProps {
  results: Array<{
    command: string;
    result: {
      stdout: string;
      stderr: string;
      returncode: number;
    };
    timestamp: string;
  }>;
}

const CommandResult = ({ results }: CommandResultProps) => {
  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Command Results</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center py-8">
          No commands executed yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Command Results</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {results.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 border-b ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.result.returncode === 0 ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
                <p className="font-bold font-mono text-sm">{item.command}</p>
              </div>
              
              {item.result.stdout && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-muted-foreground mb-1">STDOUT:</p>
                  <pre className="bg-black text-white p-2 rounded text-xs overflow-x-auto">
                    {item.result.stdout}
                  </pre>
                </div>
              )}
              
              {item.result.stderr && (
                <div>
                  <p className="text-xs font-bold text-red-500 mb-1">STDERR:</p>
                  <pre className="bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400 p-2 rounded text-xs overflow-x-auto">
                    {item.result.stderr}
                  </pre>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CommandResult;
