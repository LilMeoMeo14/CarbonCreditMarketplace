import React from 'react';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Router } from './components/Router';
import { Toaster } from './components/ui/sonner';

// Re-export hooks for components (temporary for build cache fix)
export { useRouter, useAppContext, useLanguage };

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <AppProvider>
          <div className="min-h-screen bg-background">
            <Router />
            <Toaster position="top-right" richColors />
          </div>
        </AppProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}