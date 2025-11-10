import React, { createContext, useContext, useState } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  navigateTo: (path: string) => void; // Alias
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  navigateTo: () => {}
});

export const useRouter = () => useContext(RouterContext);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState('/');

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  const value = {
    currentPath,
    navigate,
    navigateTo: navigate // Alias for consistency
  };

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
