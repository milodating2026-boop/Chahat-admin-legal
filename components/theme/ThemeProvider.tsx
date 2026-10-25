'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Synchronize on mount and listen to device preference changes
  useEffect(() => {
    // 1. Read stored preference if any (defaults to 'system')
    const saved = (localStorage.getItem('chahat_theme_mode') as ThemeMode) || 'system';
    setThemeState(saved);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentMode: ThemeMode) => {
      let isDark = false;
      if (currentMode === 'dark') {
        isDark = true;
      } else if (currentMode === 'light') {
        isDark = false;
      } else {
        // 'system' mode: strictly follow the device setting
        isDark = mediaQuery.matches;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');

      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme(saved);

    // 2. Real-time device theme change listener
    const handleChange = () => {
      const currentSaved = (localStorage.getItem('chahat_theme_mode') as ThemeMode) || 'system';
      if (currentSaved === 'system') {
        applyTheme('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('chahat_theme_mode', newTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = newTheme === 'dark' || (newTheme === 'system' && mediaQuery.matches);

    setResolvedTheme(isDark ? 'dark' : 'light');

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Compact Theme Switcher button showing Device / Light / Dark status
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`Current: ${theme === 'system' ? `Device (${resolvedTheme})` : theme}. Click to toggle.`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        resolvedTheme === 'dark'
          ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
      } ${className}`}
    >
      {theme === 'system' ? (
        <>
          <Laptop className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden md:inline">Auto</span>
        </>
      ) : theme === 'dark' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">Light</span>
        </>
      )}
    </button>
  );
}
