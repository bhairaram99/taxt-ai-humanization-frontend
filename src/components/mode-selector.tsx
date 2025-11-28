import { transformationModes, modeInfo, type TransformationMode } from "@shared/schema";
import { Button } from "./ui/button";

interface ModeSelectorProps {
  selectedMode: TransformationMode;
  onModeChange: (mode: TransformationMode) => void;
}

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Transformation Mode
      </label>
      <div className="flex flex-wrap gap-2">
        {transformationModes.map((mode) => (
          <Button
            key={mode}
            variant={selectedMode === mode ? "default" : "outline"}
            onClick={() => onModeChange(mode)}
            className="flex-1 min-w-[140px]"
            data-testid={`button-mode-${mode}`}
          >
            {modeInfo[mode].label}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {modeInfo[selectedMode].description}
      </p>
    </div>
  );
}
