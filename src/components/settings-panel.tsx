import { audienceInfo, type TargetAudience } from "@shared/schema";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface SettingsPanelProps {
  formality: number;
  targetAudience: TargetAudience;
  verbosity: "concise" | "balanced" | "detailed";
  deepHumanization: boolean; // Always true, kept for compatibility
  onFormalityChange: (value: number) => void;
  onTargetAudienceChange: (value: TargetAudience) => void;
  onVerbosityChange: (value: "concise" | "balanced" | "detailed") => void;
  onDeepHumanizationChange: (value: boolean) => void; // No-op, kept for compatibility
}

export function SettingsPanel({
  formality,
  targetAudience,
  verbosity,
  deepHumanization,
  onFormalityChange,
  onTargetAudienceChange,
  onVerbosityChange,
  onDeepHumanizationChange,
}: SettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-0 h-auto hover:bg-transparent"
        data-testid="button-settings-toggle"
      >
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Advanced Settings
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="space-y-6 pt-2">
          {/* Deep Humanization Always Enabled Message */}
          <div className="flex items-center gap-3 p-4 border border-green-500/20 rounded-lg bg-green-500/5">
            <Zap className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Deep Humanization Mode Enabled
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                3-pass transformation for maximum AI detection bypass - always active for undetectable output
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="formality" className="text-xs font-medium uppercase tracking-wide">
                Formality Level
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="formality"
                  value={[formality]}
                  onValueChange={([value]) => onFormalityChange(value)}
                  max={100}
                  step={1}
                  className="flex-1"
                  data-testid="slider-formality"
                />
                <span className="text-sm font-medium text-muted-foreground min-w-[3ch] text-right">
                  {formality}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Casual</span>
                <span>Formal</span>
              </div>
            </div>

          <div className="space-y-2">
            <Label htmlFor="audience" className="text-xs font-medium uppercase tracking-wide">
              Target Audience
            </Label>
            <Select value={targetAudience} onValueChange={onTargetAudienceChange}>
              <SelectTrigger id="audience" data-testid="select-audience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(audienceInfo).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verbosity" className="text-xs font-medium uppercase tracking-wide">
              Verbosity
            </Label>
            <Select value={verbosity} onValueChange={onVerbosityChange}>
              <SelectTrigger id="verbosity" data-testid="select-verbosity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
