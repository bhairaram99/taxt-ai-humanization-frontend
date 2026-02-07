import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type TargetAudience, type TransformationResponse, type TransformationMode, transformationRequestSchema } from "@shared/schema";
import { SettingsPanel } from "@/components/settings-panel";
import { TextAreaPanel } from "@/components/text-area-panel";
import { DiffViewer } from "@/components/diff-viewer";
import { HistoryPanel } from "@/components/history-panel";
import { ModeSelector } from "@/components/mode-selector";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { GuestModal } from "@/components/auth/GuestModal";
import { PlansSection } from "@/components/plans/PlansSection";
import { Sparkles, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState("");
  const [humanizedText, setHumanizedText] = useState("");
  const [formality, setFormality] = useState(50);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("general");
  const [verbosity, setVerbosity] = useState<"concise" | "balanced" | "detailed">("balanced");
  const [mode, setMode] = useState<TransformationMode>("paraphrase");
  const [showHistory, setShowHistory] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  // Always use deep humanization mode
  const deepHumanization = true;

  // Fetch transformation history
  const { data: history = [] } = useQuery<TransformationResponse[]>({
    queryKey: ["/api/transformations"],
  });

  // Transform mutation
  const transformMutation = useMutation({
    mutationFn: async (data: typeof transformationRequestSchema._type) => {
      const res = await apiRequest("POST", "/api/transform", data);
      const json = await res.json();
      // Backend returns { success: true, data: { ... } }
      // Unwrap so callers receive the TransformationResponse directly
      return (json && json.data) ? (json.data as TransformationResponse) : (json as TransformationResponse);
    },
    onSuccess: (data: TransformationResponse) => {
      setHumanizedText(data.humanizedText);
      queryClient.invalidateQueries({ queryKey: ["/api/transformations"] });
      toast({
        title: "Success! Undetectable content ready",
        description: "Your text has been humanized and will bypass all AI detectors.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Transformation failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/transformations/${id}`, undefined);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transformations"] });
      toast({
        title: "Deleted",
        description: "History item removed.",
      });
    },
  });

  const handleTransform = async () => {
    if (!originalText.trim()) {
      toast({
        title: "No text to transform",
        description: "Please enter some text before humanizing.",
        variant: "destructive",
      });
      return;
    }

    transformMutation.mutate({
      originalText,
      mode,
      formality,
      targetAudience,
      verbosity,
      deepHumanization,
    });
  };

  const handleRestore = (item: TransformationResponse) => {
    setOriginalText(item.originalText);
    setHumanizedText(item.humanizedText);
    setFormality(item.formality);
    setTargetAudience(item.targetAudience);
    setVerbosity(item.verbosity);
    setShowHistory(false);
    
    toast({
      title: "Transformation restored",
      description: "Previous transformation has been loaded.",
    });
  };

  const handleDeleteHistory = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (originalText.trim() && !transformMutation.isPending) {
          handleTransform();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [originalText, transformMutation.isPending]);

  const handleLoginClick = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <Navbar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />

      {/* Guest Detection Modal */}
      <GuestModal onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultTab={authModalTab} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-b from-background to-muted/20 border-b border-border py-12 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Powered by Advanced AI
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Text Humanizer
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Transform AI-generated content into natural, human-like text that bypasses all AI detectors
              </p>
            </div>
          </div>

        {/* Settings & Input Form - NOW VISIBLE FIRST */}
        <div className="border-b border-border bg-card p-6 space-y-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Input Textarea */}
            <TextAreaPanel
              title="AI-Generated Text"
              value={originalText}
              onChange={setOriginalText}
              placeholder="Paste your AI-generated content here (from ChatGPT, Gemini, Claude, etc.)..."
              showClear={true}
              testIdPrefix="original"
            />

            {/* Settings Panel */}
            <SettingsPanel
              formality={formality}
              targetAudience={targetAudience}
              deepHumanization={deepHumanization}
              verbosity={verbosity}
              onFormalityChange={setFormality}
              onTargetAudienceChange={setTargetAudience}
              onVerbosityChange={setVerbosity}
              onDeepHumanizationChange={() => {}} // Always deep, no toggle
            />

            {/* Mode Selector */}
            <ModeSelector selectedMode={mode} onModeChange={setMode} />

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleTransform}
                  disabled={transformMutation.isPending || !originalText.trim()}
                  className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  data-testid="button-transform"
                >
                  {transformMutation.isPending ? (
                    <>
                      <span className="animate-pulse">Humanizing Your Text...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Humanize Text
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-6 py-6"
                  data-testid="button-toggle-history"
                >
                  <History className="h-5 w-5 mr-2" />
                  {showHistory ? 'Hide History' : 'View History'}
                </Button>
              </div>
              
              {transformMutation.isPending && (
                <div className="w-80">
                  <Progress value={undefined} className="h-1 bg-gradient-to-r from-purple-200 to-blue-200" />
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">Ctrl+Enter</kbd> to humanize instantly
              </p>
            </div>
          </div>
        </div>

        {/* AI Detector Logos Section */}
        <div className="bg-card border-b border-border py-8">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
              Bypass All Major AI Detectors
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center">
              {[
                { name: "Turnitin", color: "text-blue-600" },
                { name: "Copyleaks", color: "text-purple-600" },
                { name: "ZeroGPT", color: "text-green-600" },
                { name: "QuillBot", color: "text-orange-600" },
                { name: "Grammarly", color: "text-emerald-600" },
                { name: "GPTZero", color: "text-indigo-600" }
              ].map((detector) => (
                <div key={detector.name} className="flex items-center justify-center">
                  <span className={`text-lg font-bold ${detector.color} opacity-70 hover:opacity-100 transition-opacity`}>
                    {detector.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output Comparison Area */}
        <div className="border-b border-border bg-card p-6">
          <div className="max-w-6xl mx-auto">
            <DiffViewer original={originalText} humanized={humanizedText} />
          </div>
        </div>

        {/* Plans Section */}
        <PlansSection />
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onRestore={handleRestore}
          onDelete={handleDeleteHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
    </div>
  );
}
