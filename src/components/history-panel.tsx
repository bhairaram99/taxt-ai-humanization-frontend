import { type TransformationResponse, modeInfo } from "@shared/schema";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { RotateCcw, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryPanelProps {
  history: TransformationResponse[];
  onRestore: (item: TransformationResponse) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function HistoryPanel({ history, onRestore, onDelete, onClose }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="w-80 border-l border-border bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">History</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-history-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-12">
          No transformations yet. Start by entering some text and clicking Transform.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-xl font-semibold">History</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-history-close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover-elevate cursor-pointer group"
            onClick={() => onRestore(item)}
            data-testid={`history-item-${item.id}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary">
                  {modeInfo[item.mode].label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(item);
                  }}
                  className="h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-restore-${item.id}`}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-delete-${item.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm line-clamp-2 text-muted-foreground">
              {item.originalText}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
