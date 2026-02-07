import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogOut, User, Settings, Coins } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function Navbar({ onLoginClick, onSignupClick }: NavbarProps) {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const getUserInitials = (emailOrName: string) => {
    return emailOrName.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.username) return user.username;
    return user?.email || 'User';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Humanizer
          </span>
        </div>

        {/* Right side - Auth buttons or User menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={onLoginClick}>
                Login
              </Button>
              <Button onClick={onSignupClick} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Sign Up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 gap-2 pl-3 pr-2">
                  <div className="flex flex-col items-end text-xs">
                    <span className="font-medium">{getDisplayName()}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {profile ? profile.tokensRemaining.toLocaleString() : '...'} tokens
                    </span>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      {getUserInitials(getDisplayName())}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Coins className="mr-2 h-4 w-4" />
                  <span>Token Usage</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
