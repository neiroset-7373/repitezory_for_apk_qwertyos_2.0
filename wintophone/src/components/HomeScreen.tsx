import React, { useState, useEffect } from 'react';
import '../styles/HomeScreen.css';

interface HomeScreenProps {
  theme: string;
  iconStyle: string;
  onOpenApp: (app: string) => void;
  installedApps: {id: string; name: string; icon: string}[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({ theme, iconStyle, onOpenApp, installedApps }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    forceUpdate(prev => prev + 1);
  }, [iconStyle]);

  const getIconPath = (app: string) => {
    if (iconStyle === 'wintozo') {
      const wintozoIcons: Record<string, string> = {
        camera: 'camera.jpeg',
        gallery: 'gallery_App.png',
        messages: 'messeges.png',
        dialer: 'phone.jpg',
        browser: 'browser.png',
        music: 'music.png',
        notes: 'zametki.png',
        calculator: 'calculator.png',
        settings: 'settings.png',
        qwerty_apps: 'qwerty_Apps.png',
      };
      if (wintozoIcons[app]) {
        return '/apps_icons/system/Wintozo Syle/' + wintozoIcons[app];
      }
    }
    const androidIcons: Record<string, string> = {
      camera: 'camera.jpeg',
      gallery: 'gallery.webp',
      messages: 'messages.jpg',
      dialer: 'dialer.jpg',
      browser: 'browser.png',
      music: 'music.png',
      notes: 'zametki.png',
      calculator: 'calculator.jpg',
      settings: 'settings.jpeg',
      qwerty_apps: 'store.png',
    };
    return '/apps_icons/system/Android Style/' + (androidIcons[app] || 'browser.png');
  };

  const systemApps = [
    { id: 'camera', name: 'Камера', icon: '' },
    { id: 'gallery', name: 'Галерея', icon: '' },
    { id: 'messages', name: 'Сообщения', icon: '' },
    { id: 'dialer', name: 'Телефон', icon: '' },
    { id: 'browser', name: 'Браузер', icon: '' },
    { id: 'music', name: 'Музыка', icon: '' },
    { id: 'notes', name: 'Заметки', icon: '' },
    { id: 'calculator', name: 'Калькулятор', icon: '' },
    { id: 'settings', name: 'Настройки', icon: '' },
    { id: 'qwerty_apps', name: 'Магазин', icon: '' },
  ];

  const allApps = [...systemApps, ...installedApps];

  const formatTime = (date: Date) => date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date: Date) => date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={'home-screen theme-' + theme}>
      <div className='status-bar'>
        <div className='status-time'>{formatTime(currentTime)}</div>
        <div className='status-icons'>📶 🔋</div>
      </div>
      <div className='clock-section'>
        <div className='big-time'>{formatTime(currentTime)}</div>
        <div className='big-date'>{formatDate(currentTime)}</div>
      </div>
      <div className='app-grid'>
        {allApps.map((app) => (
          <div key={app.id} className='app-icon-wrapper' onClick={() => onOpenApp(app.id)}>
            <div className='app-icon'>
              <img src={app.icon || getIconPath(app.id)} alt={app.name} />
            </div>
            <span className='app-label'>{app.name}</span>
          </div>
        ))}
      </div>
      <div className='dock'>
        {['camera', 'messages', 'dialer', 'browser'].map((id) => {
          const app = systemApps.find(a => a.id === id);
          return (
            <div key={id} className='dock-icon-wrapper' onClick={() => onOpenApp(id)}>
              <div className='app-icon'>
                <img src={getIconPath(id)} alt={app?.name} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
