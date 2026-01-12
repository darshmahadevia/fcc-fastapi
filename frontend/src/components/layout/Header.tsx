import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Moon, Sun, Rss, Home, FileText } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true); // Default to dark
  const [isAnimating, setIsAnimating] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const newIsDark = !isDark;
    
    // Set CSS custom properties for the animation origin
    document.documentElement.style.setProperty('--theme-toggle-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-toggle-y', `${y}px`);
    
    // Set transition direction BEFORE starting the transition
    // This determines which animation plays (expand vs contract)
    if (!newIsDark) {
      document.documentElement.setAttribute('data-theme-transition', 'to-light');
    } else {
      document.documentElement.removeAttribute('data-theme-transition');
    }
    
    // Check if View Transitions API is supported and user doesn't prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (document.startViewTransition && !prefersReducedMotion) {
      setIsAnimating(true);
      
      const transition = document.startViewTransition(() => {
        if (newIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setIsDark(newIsDark);
      });
      
      transition.finished.finally(() => {
        // Clean up the transition attribute
        document.documentElement.removeAttribute('data-theme-transition');
        setIsAnimating(false);
      });
    } else {
      // Simple fallback without animation
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.removeAttribute('data-theme-transition');
      setIsDark(newIsDark);
    }
  }, [isDark, isAnimating]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // Scroll-based effects
  const { scrollY } = useScroll();
  const headerPadding = useTransform(scrollY, [0, 100], [12, 0]);
  const headerScale = useTransform(scrollY, [0, 100], [0.98, 1]);

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Spacer that shrinks on scroll */}
      <motion.div 
        className="bg-transparent"
        style={{ height: headerPadding }}
      />
      
      {/* Actual header bar */}
      <motion.div 
        className="mx-2 sm:mx-4 rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_4px_30px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.2)_inset] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)_inset]"
        style={{ scale: headerScale }}
      >
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              PostHub
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2 text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10',
                    isActive('/') && 'text-foreground bg-white/60 dark:bg-white/15 backdrop-blur-sm'
                  )}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </motion.div>
            </Link>
            <Link to="/feed">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'gap-2 text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10',
                    isActive('/feed') && 'text-foreground bg-white/60 dark:bg-white/15 backdrop-blur-sm'
                  )}
                >
                  <Rss className="h-4 w-4" />
                  Feed
                </Button>
              </motion.div>
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <nav className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              ref={toggleRef}
              onClick={toggleTheme}
              disabled={isAnimating}
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur-lg border border-white/30 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/20 shadow-lg shadow-black/5"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {isDark ? (
                  <Moon className="h-4 w-4 text-indigo-400" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
              </motion.div>
            </Button>
          </motion.div>

          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/20 transition-all"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-medium">
                          {user?.id ? `U${user.id}` : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                  <div className="px-3 py-2.5 border-b">
                    <p className="text-sm font-semibold">User #{user?.id}</p>
                    <p className="text-xs text-muted-foreground">Signed in</p>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem
                      className="cursor-pointer py-2.5"
                      onClick={() => navigate(`/profile/${user?.id}`)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer py-2.5"
                      onClick={() => navigate('/feed?filter=my-posts')}
                    >
                      <FileText className="mr-3 h-4 w-4" />
                      My Posts
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer py-2.5"
                      onClick={() => navigate('/feed')}
                    >
                      <Rss className="mr-3 h-4 w-4" />
                      View Feed
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <DropdownMenuItem
                      className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    Sign in
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className="shadow-sm">
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </nav>
        </div>
      </motion.div>
      
      {/* Bottom spacer */}
      <motion.div 
        className="bg-transparent"
        style={{ height: headerPadding }}
      />
    </motion.header>
  );
}
