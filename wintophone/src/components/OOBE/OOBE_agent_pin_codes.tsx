import { useState } from 'react';
import PinCodes from '../SYSTEM/Pin_Codes';

interface OOBEAgentPinCodesProps {
  onComplete: () => void;
}

const OOBEAgentPinCodes = ({ onComplete }: OOBEAgentPinCodesProps) => {
  const [step, setStep] = useState<'type' | 'pin' | 'pattern'>('type');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

const handlePinSubmit = () => {
    if (pin.length !== 4) {
      setError('Введите 4 цифры');
      return;
    }
    PinCodes.save({ type: 'pin', pin, createdAt: Date.now() });
    onComplete();
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
      color: '#fff'
    }}>
      {step === 'type' && (
        <>
          <h2 style={{ fontSize: '24px', marginBottom: '30px', fontWeight: '700' }}>
            Выберите способ защиты
          </h2>
          <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '300px' }}>
            <button
              onClick={() => setStep('pin')}
              style={{
                flex: 1,
                padding: '30px 20px',
                borderRadius: '16px',
                border: 'none',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              PIN-код
            </button>
            <button
              onClick={() => setStep('pattern')}
              style={{
                flex: 1,
                padding: '30px 20px',
                borderRadius: '16px',
                border: 'none',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              Графический ключ
            </button>
          </div>
        </>
      )}

      {step === 'pin' && (
        <>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '700' }}>
            Создайте PIN-код
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '30px' }}>
            Введите 4 цифры для разблокировки
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '50px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700'
                }}
              >
                {pin[i] || ''}
              </div>
            ))}
          </div>
          {error && (
            <p style={{ color: '#ff6b6b', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (num === '⌫') {
                    setPin(pin.slice(0, -1));
                    setError('');
                  } else if (num) {
                    if (pin.length < 4) {
                      setPin(pin + num);
                      setError('');
                    }
                  }
                }}
                disabled={!num}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '24px',
                  fontWeight: '600',
                  cursor: num ? 'pointer' : 'default',
                  transition: 'transform 0.2s'
                }}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={handlePinSubmit}
            style={{
              marginTop: '30px',
              padding: '16px 48px',
              borderRadius: '12px',
              border: 'none',
              background: '#007aff',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Готово
          </button>
        </>
      )}

      {step === 'pattern' && (
        <>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '700' }}>
            Нарисуйте графический ключ
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '30px' }}>
            Соедините минимум 4 точки
          </p>
          <PatternLock onComplete={(pattern) => {
            if (pattern.length < 4) {
              setError('Нарисуйте паттерн минимум из 4 точек');
              return;
            }
            PinCodes.save({ type: 'pattern', pattern, createdAt: Date.now() });
            onComplete();
          }} />
          {error && (
            <p style={{ color: '#ff6b6b', marginTop: '20px', fontSize: '14px' }}>
              {error}
            </p>
          )}
        </>
      )}
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

  return (
    <div
      style={{
        width: '280px',
        height: '280px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        padding: '20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px'
      }}
    >
      {points.map((point) => (
        <button
          key={point}
          onClick={() => handlePointClick(point)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: `3px solid ${selected.includes(point) ? '#007aff' : 'rgba(255,255,255,0.3)'}`,
            background: selected.includes(point) ? '#007aff' : 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        />
      ))}
    </div>
  );
};

export default OOBEAgentPinCodes;