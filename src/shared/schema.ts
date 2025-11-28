// Transformation modes - SYNCED WITH BACKEND
export const transformationModes = ["paraphrase", "style", "tone", "vocabulary"] as const;
export type TransformationMode = typeof transformationModes[number];

export const modeInfo: Record<TransformationMode, { label: string; description: string }> = {
  paraphrase: {
    label: "Paraphrase",
    description: "Rephrase the text with different wording while maintaining meaning",
  },
  style: {
    label: "Style",
    description: "Adjust the writing style for better readability and flow",
  },
  tone: {
    label: "Tone",
    description: "Modify the emotional tone and voice of the text",
  },
  vocabulary: {
    label: "Vocabulary",
    description: "Replace with more sophisticated or varied word choices",
  },
};

// Target audiences - SYNCED WITH BACKEND
export const audiences = ["general", "academic", "professional", "casual", "technical"] as const;
export type TargetAudience = typeof audiences[number];

export const audienceInfo: Record<TargetAudience, string> = {
  general: "General Audience",
  academic: "Academic",
  professional: "Professional",
  casual: "Casual",
  technical: "Technical",
};

// Transformation request schema
export interface TransformationRequest {
  originalText: string;
  mode: TransformationMode;
  formality: number;
  targetAudience: TargetAudience;
  verbosity: "concise" | "balanced" | "detailed";
  deepHumanization: boolean;
}

// Transformation response schema
export interface TransformationResponse {
  id: string;
  originalText: string;
  humanizedText: string;
  mode: TransformationMode;
  formality: number;
  targetAudience: TargetAudience;
  verbosity: "concise" | "balanced" | "detailed";
  deepHumanization: boolean;
  timestamp: number;
}

// Zod-like schema for validation
export const transformationRequestSchema = {
  _type: {} as TransformationRequest,
};
