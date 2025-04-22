
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { File } from "lucide-react";

interface FileInfoProps {
  fileName: string | null;
}

const FileInfo = ({ fileName }: FileInfoProps) => {
  if (!fileName) {
    return null;
  }

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded">
          <File size={18} className="text-primary" />
        </div>
        <div>
          <p className="font-medium truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">File ready for commands</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileInfo;
