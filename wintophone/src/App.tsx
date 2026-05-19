import { useState, useEffect } from 'react';
import PhoneFrame from './components/PhoneFrame';
import SetupScreen from './components/SetupScreen';
import OOBE from './components/OOBE';
import HomeScreen from './components/HomeScreen';
import CameraApp from './components/CameraApp';
import SettingsApp from './components/SettingsApp';
import MessagesApp from './components/MessagesApp';
import DialerApp from './components/DialerApp';
import GalleryApp from './components/GalleryApp';
import QwertyApps from './components/QwertyApps';
import BrowserApp from './components/BrowserApp';
import CalculatorApp from './components/CalculatorApp';
import MusicApp from './components/MusicApp';
import NotesApp from './components/NotesApp';
import './styles/AppTransitions.css';

function App() {
  const [showSetup, setShowSetup] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [theme, setTheme] = useState('white');
  const [iconStyle, setIconStyle] = useState('android');
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [appAnimating, setAppAnimating] = useState(false);
  const [installedApps, setInstalledApps] = useState<{id: string, name: string, icon: string}[]>([]);
  const [currentSetupSlide, setCurrentSetupSlide] = useState(0);

  useEffect(() => {
    const oobeCompleted = localStorage.getItem('wintophone_oobe_completed');
    if (oobeCompleted) {
      const savedTheme = localStorage.getItem('wintophone_theme') || 'white';
      const savedIconStyle = localStorage.getItem('wintophone_icon_style') || 'android';
      setTheme(savedTheme);
      setIconStyle(savedIconStyle);
      setIsFirstRun(false);
    }
    
    const savedApps = localStorage.getItem('wintophone_installed_apps');
    if (savedApps) {
      setInstalledApps(JSON.parse(savedApps));
    }
  }, []);

  useEffect(() => {
    const handleAppInstalled = () => {
      const savedApps = localStorage.getItem('wintophone_installed_apps');
      if (savedApps) {
        setInstalledApps(JSON.parse(savedApps));
      }
    };
    
    const handleOpenAppEvent = (e: CustomEvent) => {
      handleOpenApp(e.detail);
    };

    window.addEventListener('appInstalled', handleAppInstalled);
    window.addEventListener('openApp' as any, handleOpenAppEvent as any);
    return () => {
      window.removeEventListener('appInstalled', handleAppInstalled);
      window.removeEventListener('openApp' as any, handleOpenAppEvent as any);
    };
  }, []);

  const handleSetupComplete = () => {
    setShowSetup(false);
  };

  const handleOOBEComplete = (selectedTheme: string, selectedIconStyle: string) => {
    setTheme(selectedTheme);
    setIconStyle(selectedIconStyle);
    setIsFirstRun(false);
    localStorage.setItem('wintophone_oobe_completed', 'true');
    localStorage.setItem('wintophone_theme', selectedTheme);
    localStorage.setItem('wintophone_icon_style', selectedIconStyle);
  };

  const handleOpenApp = (appId: string) => {
    setAppAnimating(true);
    setCurrentApp(appId);
    setTimeout(() => setAppAnimating(false), 300);
  };

  const handleCloseApp = () => {
    setAppAnimating(true);
    setTimeout(() => {
      setCurrentApp(null);
      setAppAnimating(false);
    }, 300);
  };

  const handleAppInstalled = (app: { id: string; name: string; icon: string }) => {
    const savedApps = localStorage.getItem('wintophone_installed_apps');
    const apps = savedApps ? JSON.parse(savedApps) : [];
    if (!apps.find((a: { id: string }) => a.id === app.id)) {
      apps.push(app);
      localStorage.setItem('wintophone_installed_apps', JSON.stringify(apps));
      setInstalledApps(apps);
      window.dispatchEvent(new Event('appInstalled'));
    }
  };

  const renderApp = () => {
    const appProps = { onClose: handleCloseApp, theme };

    switch (currentApp) {
      case 'camera':
        return <CameraApp {...appProps} />;
      case 'settings':
        return <SettingsApp {...appProps} />;
      case 'messages':
        return <MessagesApp {...appProps} />;
      case 'dialer':
        return <DialerApp {...appProps} />;
      case 'gallery':
        return <GalleryApp {...appProps} />;
      case 'qwerty_apps':
        return <QwertyApps {...appProps} onAppInstalled={handleAppInstalled} onOpenApp={handleOpenApp} />;
      case 'browser':
        return <BrowserApp {...appProps} />;
      case 'calculator':
        return <CalculatorApp {...appProps} />;
      case 'music':
        return <MusicApp {...appProps} />;
      case 'notes':
        return <NotesApp {...appProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <PhoneFrame theme={theme}>
        <div className="screen-content">
          {showSetup ? (
            <SetupScreen 
              onComplete={handleSetupComplete} 
              isFirstRun={isFirstRun}
              currentSlide={currentSetupSlide}
              setCurrentSlide={setCurrentSetupSlide}
            />
          ) : isFirstRun ? (
            <OOBE onComplete={handleOOBEComplete} />
          ) : currentApp ? (
            <div className={`app-transition ${appAnimating ? 'animating' : ''}`}>
              {renderApp()}
            </div>
          ) : (
            <HomeScreen 
              theme={theme} 
              iconStyle={iconStyle} 
              onOpenApp={handleOpenApp}
              installedApps={installedApps}
            />
          )}
        </div>
      </PhoneFrame>
    </div>
  );
}

export default App;
