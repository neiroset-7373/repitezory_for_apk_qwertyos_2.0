import { useState } from 'react';
import './styles/HomeScreen.css';

interface HomeScreenProps {
  onOpenApp: (appId: string) => void;
  onLock?: () => void;
}

const HomeScreen = ({ onOpenApp, onLock }: HomeScreenProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  const apps = [
    { id: 'phone', name: 'Телефон', icon: '/apps_icons/system/Wintozo Syle/phone.jpg' },
    { id: 'messages', name: 'Сообщения', icon: '/apps_icons/system/Wintozo Syle/messeges.png' },
    { id: 'camera', name: 'Камера', icon: '/apps_icons/system/Android Style/camera.jpeg' },
    { id: 'gallery', name: 'Галерея', icon: '/apps_icons/system/Wintozo Syle/gallery_App.png' },
    { id: 'music', name: 'Музыка', icon: '/apps_icons/system/Wintozo Syle/music.png' },
    { id: 'browser', name: 'Браузер', icon: '/apps_icons/system/Wintozo Syle/browser.png' },
    { id: 'calculator', name: 'Калькулятор', icon: '/apps_icons/system/Wintozo Syle/calculator.png' },
    { id: 'notes', name: 'Заметки', icon: '/apps_icons/system/Wintozo Syle/zametki.png' },
    { id: 'settings', name: 'Настройки', icon: '/apps_icons/system/Wintozo Syle/settings.png' },
    { id: 'qwerty', name: 'Qwerty Apps', icon: '/apps_icons/system/Wintozo Syle/qwerty_Apps.png' },
  ];

  const dockApps = [
    { id: 'phone', icon: '/apps_icons/system/Wintozo Syle/phone.jpg' },
    { id: 'messages', icon: '/apps_icons/system/Wintozo Syle/messeges.png' },
    { id: 'camera', icon: '/apps_icons/system/Android Style/camera.jpeg' },
    { id: 'music', icon: '/apps_icons/system/Wintozo Syle/music.png' },
  ];

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  return (
    <div className="home-screen">
      <div className="status-bar">
        <span className="status-bar-time">{timeString}</span>
        <div className="status-bar-icons">
          {onLock && (
            <button className="status-bar-button" onClick={onLock} title="Заблокировать">
              🔒
            </button>
          )}
          <span className="status-bar-icon">📶</span>
          <span className="status-bar-icon">🔋</span>
        </div>
      </div>

      <div className="home-content">
        <div className="clock-widget">
          <div className="clock-time">{timeString}</div>
          <div className="clock-date">
            {currentTime.toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </div>
        </div>

        <div className="apps-grid">
          {apps.map((app) => (
            <button
              key={app.id}
              className="app-icon"
              onClick={() => onOpenApp(app.id)}
            >
              <img src={app.icon} alt={app.name} />
              <span className="app-name">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dock">
        {dockApps.map((app) => (
          <button
            key={app.id}
            className="dock-icon"
            onClick={() => onOpenApp(app.id)}
          >
            <img src={app.icon} alt={app.id} />
          </button>
        ))}
      </div>

      <div className="home-indicator" />
    </div>
  );
};

export default HomeScreen;