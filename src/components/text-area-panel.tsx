import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Copy, X, Check } from "lucide-react";
import { useState } from "react";

interface TextAreaPanelProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  showCopy?: boolean;
  showClear?: boolean;
  readOnly?: boolean;
  testIdPrefix: string;
}

export function TextAreaPanel({
  title,
  value,
  onChange,
  placeholder,
  showCopy = false,
  showClear = false,
  readOnly = false,
  testIdPrefix,
}: TextAreaPanelProps) {
  const [copied, setCopied] = useState(false);
  const characterCount = value.length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (onChange) {
      onChange("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground" data-testid={`${testIdPrefix}-count`}>
            {characterCount.toLocaleString()} characters
          </span>
          {showClear && value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-6 w-6"
              data-testid={`${testIdPrefix}-clear`}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {showCopy && value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-6 w-6"
              data-testid={`${testIdPrefix}-copy`}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-h-64 font-mono text-sm resize-none"
        readOnly={readOnly}
        data-testid={`${testIdPrefix}-textarea`}
        id={`${testIdPrefix}-input`}
      />
    </div>
  );
}
