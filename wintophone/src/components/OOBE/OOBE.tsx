import React, { useState, useEffect } from 'react';
import './styles/OOBE.css';

interface OOBEProps {
  onComplete: (theme: string, iconStyle: string) => void;
}

const OOBE: React.FC<OOBEProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('white');
  const [selectedIconStyle, setSelectedIconStyle] = useState('android');
  const [progress, setProgress] = useState(0);

  const themes = [
    { id: 'white', name: 'Светлая', color: '#ffffff' },
    { id: 'blue', name: 'Синяя', color: '#001133' },
    { id: 'green', name: 'Зеленая', color: '#002d04' },
    { id: 'neon', name: 'Неон', color: '#001a1a' },
  ];

  const iconStyles = [
    { id: 'android', name: 'Android Style' },
    { id: 'wintozo', name: 'Wintozo Style' },
  ];

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onComplete(selectedTheme, selectedIconStyle);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step, onComplete, selectedTheme, selectedIconStyle]);

  return (
    <div className={'oobe-container theme-' + selectedTheme}>
      {step === 0 && (
        <div className="oobe-step">
          <div className="logo-container">
            <img 
              src={selectedTheme === 'white' 
                ? '/logos_for_razine_teme/Logo_WintoPhone_for_white_theme.jpg' 
                : '/logos_for_razine_teme/Logo_WintoPhone_for_black_theme.png'} 
              alt="WintoPhone" 
              className="oobe-logo" 
            />
          </div>
          <h1 className="oobe-title">Добро пожаловать</h1>
          <p className="oobe-subtitle">Ваш новый смартфон готов к работе</p>
          <button className="oobe-button" onClick={() => setStep(1)}>Начать</button>
        </div>
      )}

      {step === 1 && (
        <div className="oobe-step">
          <h2 className="oobe-title">Выберите тему</h2>
          <div className="theme-grid">
            {themes.map((t) => (
              <div 
                key={t.id} 
                className={'theme-card' + (selectedTheme === t.id ? ' selected' : '')}
                onClick={() => setSelectedTheme(t.id)}
              >
                <div className="theme-preview" style={{ backgroundColor: t.color }} />
                <span className="theme-name">{t.name}</span>
              </div>
            ))}
          </div>
          <button className="oobe-button" onClick={() => setStep(2)}>Далее</button>
        </div>
      )}

      {step === 2 && (
        <div className="oobe-step">
          <h2 className="oobe-title">Выберите стиль иконок</h2>
          <div className="icon-style-grid">
            {iconStyles.map((style) => (
              <div 
                key={style.id} 
                className={'icon-style-card' + (selectedIconStyle === style.id ? ' selected' : '')}
                onClick={() => setSelectedIconStyle(style.id)}
              >
                <span>{style.name}</span>
              </div>
            ))}
          </div>
          <button className="oobe-button" onClick={() => setStep(3)}>Далее</button>
        </div>
      )}

      {step === 3 && (
        <div className="oobe-step">
          <div className="spinner" />
          <h2 className="oobe-title">Настройка</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: progress + '%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OOBE;
