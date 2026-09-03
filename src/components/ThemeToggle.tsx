import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('jain_theme');
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('jain_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('jain_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <button
      id="btn-theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold ${
        isDark
          ? 'bg-neutral-800 text-amber-300 hover:bg-neutral-700 hover:text-amber-200 border border-neutral-700'
          : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline-block text-2xs text-amber-200">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-amber-100" />
          <span className="hidden sm:inline-block text-2xs text-amber-100">Dark</span>
        </>
      )}
    </button>
  );
};
