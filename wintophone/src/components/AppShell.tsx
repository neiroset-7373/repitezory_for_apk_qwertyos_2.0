import { useState, useEffect } from 'react';
import SplashScreen from './SYSTEM/SplashScreen';
import LockScreen from './SYSTEM/LockScreen';
import NewOOBE from './OOBE/New_oobe';
import HomeScreen from './Desktop/HomeScreen';
import PinCodes from './SYSTEM/Pin_Codes';
import CameraApp from './apps/CameraApp';
import SettingsApp from './apps/SettingsApp';
import MessagesApp from './apps/MessagesApp';
import DialerApp from './apps/DialerApp';
import GalleryApp from './apps/GalleryApp';
import QwertyApps from './apps/QwertyApps';
import BrowserApp from './apps/BrowserApp';
import CalculatorApp from './apps/CalculatorApp';
import MusicApp from './apps/MusicApp';
import NotesApp from './apps/NotesApp';
import './styles/AppShell.css';

const AppShell = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOOBE, setShowOOBE] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [theme] = useState('white');

  useEffect(() => {
    const hasCompletedOOBE = localStorage.getItem('hasCompletedOOBE');
    const hasSecurity = PinCodes.hasSecurity();

    if (!hasCompletedOOBE) {
      setShowSplash(false);
      setShowOOBE(true);
    } else if (hasSecurity) {
      setShowSplash(false);
      setShowLockScreen(true);
    } else {
      setShowSplash(false);
      setShowHome(true);
    }
  }, []);

  const handleOOBEComplete = () => {
    localStorage.setItem('hasCompletedOOBE', 'true');
    setShowOOBE(false);
    setShowHome(true);
  };

  const handleUnlock = () => {
    setShowLockScreen(false);
    setShowHome(true);
  };

  const handleOpenApp = (appId: string) => {
    setActiveApp(appId);
  };

  const handleCloseApp = () => {
    setActiveApp(null);
  };

  const handleLock = () => {
    setActiveApp(null);
    setShowHome(false);
    setShowLockScreen(true);
  };

  const renderApp = (appId: string) => {
    const appProps = { onClose: handleCloseApp, theme };

    switch (appId) {
      case 'phone':
        return <DialerApp {...appProps} />;
      case 'messages':
        return <MessagesApp {...appProps} />;
      case 'camera':
        return <CameraApp {...appProps} />;
      case 'gallery':
        return <GalleryApp {...appProps} />;
      case 'music':
        return <MusicApp {...appProps} />;
      case 'browser':
        return <BrowserApp {...appProps} />;
      case 'calculator':
        return <CalculatorApp {...appProps} />;
      case 'notes':
        return <NotesApp {...appProps} />;
      case 'settings':
        return <SettingsApp {...appProps} />;
      case 'qwerty':
        return <QwertyApps {...appProps} onOpenApp={handleOpenApp} onAppInstalled={() => {}} />;
      default:
        return <div className="app-placeholder">Приложение</div>;
    }
  };

  return (
    <div className="app-shell">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {showOOBE && <NewOOBE onComplete={handleOOBEComplete} />}
      
      {showLockScreen && <LockScreen onUnlock={handleUnlock} />}
      
      {showHome && !activeApp && (
        <HomeScreen onOpenApp={handleOpenApp} onLock={handleLock} />
      )}
      
      {activeApp && (
        <div className="app-container">
          {renderApp(activeApp)}
          <button className="close-app-button" onClick={handleCloseApp}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AppShell;