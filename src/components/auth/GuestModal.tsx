import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, UserCircle, Zap } from 'lucide-react';

interface GuestModalProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const GUEST_PROMPT_KEY = 'guestPromptShown';

export function GuestModal({ onLoginClick, onSignupClick }: GuestModalProps) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Don't show if user is authenticated
    if (isAuthenticated) {
      return;
    }

    // Check if we've already shown the prompt
    const hasShown = localStorage.getItem(GUEST_PROMPT_KEY);
    
    if (!hasShown) {
      // Show the modal after a brief delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setOpen(false);
    // Mark that we've shown the prompt
    localStorage.setItem(GUEST_PROMPT_KEY, 'true');
  };

  const handleLogin = () => {
    handleClose();
    onLoginClick();
  };

  const handleSignup = () => {
    handleClose();
    onSignupClick();
  };

  const handleContinueAsGuest = () => {
    handleClose();
  };

  // Don't render if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Welcome to AI Humanizer! 👋
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Get the most out of our AI-powered text humanization platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <UserCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Create a Free Account</p>
              <p className="text-xs text-muted-foreground">
                Save your work, access history, and get more tokens
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Unlock Premium Features</p>
              <p className="text-xs text-muted-foreground">
                Advanced AI models, priority support, and unlimited conversions
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Button 
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            Create Free Account
          </Button>
          
          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full"
            size="lg"
          >
            I Already Have an Account
          </Button>

          <Button 
            onClick={handleContinueAsGuest}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            size="sm"
          >
            Continue as Guest
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Free account includes 5,000 tokens • No credit card required
        </p>
      </DialogContent>
    </Dialog>
  );
}
