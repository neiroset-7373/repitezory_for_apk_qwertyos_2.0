import { useState } from 'react';
import PinCodes from './Pin_Codes';
import './styles/LockScreen.css';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const securityData = PinCodes.load();
  const isPin = securityData?.type === 'pin';
  const isPattern = securityData?.type === 'pattern';

  const handlePinSubmit = () => {
    if (PinCodes.verifyPin(pin)) {
      onUnlock();
    } else {
      setError('Неверный PIN-код');
      setPin('');
      setTimeout(() => setError(''), 2000);
    }
  };

  const handlePatternComplete = (newPattern: number[]) => {
    if (PinCodes.verifyPattern(newPattern)) {
      onUnlock();
    } else {
      setError('Неверный графический ключ');
      setTimeout(() => setError(''), 2000);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="lock-screen">
      <div className="lock-header">
        <div className="lock-time">{getCurrentTime()}</div>
        <div className="lock-date">{getCurrentDate()}</div>
      </div>

      {isPin && (
        <div className="lock-content">
          <p className="lock-prompt">Введите PIN-код</p>
          
          <div className="pin-display">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`pin-dot ${pin[i] ? 'filled' : ''}`} />
            ))}
          </div>

          {error && <p className="lock-error">{error}</p>}

          <div className="pin-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (num === '⌫') {
                    setPin(pin.slice(0, -1));
                    setError('');
                  } else if (num) {
                    if (pin.length < 4) {
                      const newPin = pin + num;
                      setPin(newPin);
                      setError('');
                      if (newPin.length === 4) {
                        setTimeout(handlePinSubmit, 100);
                      }
                    }
                  }
                }}
                disabled={!num}
                className={`pin-key ${!num ? 'empty' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {isPattern && (
        <div className="lock-content">
          <p className="lock-prompt">Нарисуйте графический ключ</p>
          
          {error && <p className="lock-error">{error}</p>}

          <PatternLock onComplete={handlePatternComplete} />
        </div>)}
    </div>
  );
};

const PatternLock = ({ onComplete }: { onComplete: (pattern: number[]) => void }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const points = Array.from({ length: 9 }, (_, i) => i);

  const handlePointClick = (index: number) => {
    if (!selected.includes(index)) {
      const newSelected = [...selected, index];
      setSelected(newSelected);
      if (newSelected.length >= 4) {
        setTimeout(() => onComplete(newSelected), 300);
      }
    }
  };

  const handleReset = () => {
    setSelected([]);
  };

  return (
    <div className="pattern-lock-container">
      <div className="pattern-grid">
        {points.map((point) => (
          <button
            key={point}
            onClick={() => handlePointClick(point)}
            className={`pattern-point ${selected.includes(point) ? 'selected' : ''}`}
          />
        ))}
      </div>
      <button onClick={handleReset} className="pattern-reset">
        Сбросить
      </button>
    </div>
  );
};

export default LockScreen;