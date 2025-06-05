
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Play, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CommandInputProps {
  sessionId: string | null;
  onCommandExecuted: (result: any) => void;
  onClearResults: () => void;
  isExecuting: boolean;
  setIsExecuting: (isExecuting: boolean) => void;
}

const CommandInput = ({ 
  sessionId, 
  onCommandExecuted, 
  onClearResults,
  isExecuting,
  setIsExecuting
}: CommandInputProps) => {
  const [command, setCommand] = useState('');
  const { toast } = useToast();

  const handleCommandChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommand(e.target.value);
  };

  const executeCommand = async () => {
    if (!sessionId) {
      toast({
        variant: "destructive",
        title: "No File Uploaded",
        description: "Please upload a file first.",
      });
      return;
    }

    if (!command.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Command",
        description: "Please enter a command to execute.",
      });
      return;
    }

    setIsExecuting(true);

    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: command.trim(),
          session_id: sessionId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.answer) {
        onCommandExecuted({
          question: command,
          result: {
            stdout: data.answer,
            stderr: '',
            returncode: 0,
          },
          timestamp: new Date().toISOString()
        });
      } else {
        onCommandExecuted({
          question: command,
          result: {
            stdout: '',
            stderr: data.error,
            returncode: 0,
          },
          timestamp: new Date().toISOString()
        });
        toast({
          variant: "destructive",
          title: "Execution Failed",
          description: data.error || "An error occurred during command execution.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Execution Failed",
        description: "Could not connect to the server.",
      });
      console.error('Error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClear = () => {
    setCommand('');
    onClearResults();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Textarea
          value={command}
          onChange={handleCommandChange}
          placeholder="Enter command to execute (e.g., 'ls -la' or 'python script.py')..."
          className="min-h-[100px] font-mono"
          disabled={isExecuting}
        />
      </CardContent>
      <CardFooter className="flex justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClear}
          disabled={isExecuting}
          className="gap-2"
        >
          <Trash size={16} /> Clear
        </Button>
        <Button 
          onClick={executeCommand}
          disabled={!sessionId || isExecuting}
          size="sm"
          className="gap-2"
        >
          <Play size={16} /> Run Command
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommandInput;
