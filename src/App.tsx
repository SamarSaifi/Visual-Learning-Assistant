import React, { useEffect, useState } from 'react';
import { Camera } from './components/Camera';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { getInitialTheme, setTheme, type Theme } from './lib/theme';

export default function App() {
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Visual Learning Assistant
              </h1>
            </div>
            <ThemeToggle theme={theme} onThemeChange={setCurrentTheme} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Get Instant Help with Your Questions
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Point your camera at any academic problem and get a detailed solution instantly
          </p>
        </div>

        <Camera />
      </main>
    </div>
  );
}