import { useMemo } from "react";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface DiffViewerProps {
  original: string;
  humanized: string;
}

interface DiffSegment {
  type: "same" | "added" | "removed";
  text: string;
}

function computeDiff(original: string, humanized: string): DiffSegment[] {
  const originalWords = original.split(/(\s+)/);
  const humanizedWords = humanized.split(/(\s+)/);
  const segments: DiffSegment[] = [];
  
  let i = 0;
  let j = 0;
  
  while (i < originalWords.length || j < humanizedWords.length) {
    if (i >= originalWords.length) {
      segments.push({ type: "added", text: humanizedWords[j] });
      j++;
    } else if (j >= humanizedWords.length) {
      segments.push({ type: "removed", text: originalWords[i] });
      i++;
    } else if (originalWords[i] === humanizedWords[j]) {
      segments.push({ type: "same", text: originalWords[i] });
      i++;
      j++;
    } else {
      // Simple strategy: look ahead a bit to find matches
      let foundMatch = false;
      for (let k = 1; k <= 3 && j + k < humanizedWords.length; k++) {
        if (originalWords[i] === humanizedWords[j + k]) {
          for (let m = 0; m < k; m++) {
            segments.push({ type: "added", text: humanizedWords[j + m] });
          }
          j += k;
          foundMatch = true;
          break;
        }
      }
      
      if (!foundMatch) {
        for (let k = 1; k <= 3 && i + k < originalWords.length; k++) {
          if (originalWords[i + k] === humanizedWords[j]) {
            for (let m = 0; m < k; m++) {
              segments.push({ type: "removed", text: originalWords[i + m] });
            }
            i += k;
            foundMatch = true;
            break;
          }
        }
      }
      
      if (!foundMatch) {
        segments.push({ type: "removed", text: originalWords[i] });
        segments.push({ type: "added", text: humanizedWords[j] });
        i++;
        j++;
      }
    }
  }
  
  return segments;
}

export function DiffViewer({ original, humanized }: DiffViewerProps) {
  const [copied, setCopied] = useState(false);
  
  const diff = useMemo(() => {
    if (!original || !humanized) return [];
    return computeDiff(original, humanized);
  }, [original, humanized]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(humanized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!humanized) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Your enhanced text will appear here with highlighted changes showing the transformation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Humanized Text (Changes Highlighted)
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground" data-testid="humanized-count">
            {humanized.length.toLocaleString()} characters
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-6 w-6"
            data-testid="humanized-copy"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 min-h-64 p-4 border border-border rounded-lg bg-background overflow-y-auto font-mono text-sm whitespace-pre-wrap">
        {diff.map((segment, index) => {
          if (segment.type === "same") {
            return <span key={index}>{segment.text}</span>;
          } else if (segment.type === "added") {
            return (
              <span
                key={index}
                className="bg-yellow-500/20 underline decoration-yellow-500/50"
                data-diff="added"
              >
                {segment.text}
              </span>
            );
          } else {
            // Don't display removed/deleted words
            return null;
          }
        })}
      </div>
    </div>
  );
}
