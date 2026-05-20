import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const isFirstLaunch = localStorage.getItem('isFirstLaunch');
    const duration = isFirstLaunch ? 4000 : 10000;

    const timer = setTimeout(() => {
      if (!isFirstLaunch) {
        localStorage.setItem('isFirstLaunch', 'true');
      }
      setShowSplash(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showSplash) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      zIndex: 9999
    }}>
      <img
        src="/system_setup/WintoPhone_Setup.jpg"
        alt="WintoPhone"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
};

export default SplashScreen;