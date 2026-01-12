import { createContext, useContext, useState, useEffect } from "react";

const AppToggleContext = createContext();

export const AppToggleProvider = ({ children }) => {
  // 'sportybet' or '1win'
  const [activeApp, setActiveApp] = useState(() => {
    // Get from localStorage if available, default to 'sportybet'
    const saved = localStorage.getItem('activeApp');
    return saved || 'sportybet';
  });

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem('activeApp', activeApp);
  }, [activeApp]);

  const toggleApp = () => {
    setActiveApp(prev => prev === 'sportybet' ? '1win' : 'sportybet');
  };

  const switchToApp = (app) => {
    if (app === 'sportybet' || app === '1win') {
      setActiveApp(app);
    }
  };

  return (
    <AppToggleContext.Provider value={{ activeApp, toggleApp, switchToApp }}>
      {children}
    </AppToggleContext.Provider>
  );
};

export const useAppToggle = () => {
  const context = useContext(AppToggleContext);
  if (!context) {
    throw new Error('useAppToggle must be used within an AppToggleProvider');
  }
  return context;
};














