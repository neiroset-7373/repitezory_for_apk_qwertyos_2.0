import { useState } from 'react';
import OOBEAgentPinCodes from './OOBE_agent_pin_codes';
import './styles/OOBE.css';

interface NewOOBEProps {
  onComplete: () => void;
}

const NewOOBE = ({ onComplete }: NewOOBEProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Добро пожаловать',
      subtitle: 'WintoPhone — ваш новый смартфон',
      icon: '/logos_for_razine_temi/Logo_WintoPhone_for_white_theme.jpg'
    },
    {
      title: 'Безопасность',
      subtitle: 'Защитите свой телефон',
      icon: '/settings/Vkladka_bezopasnost.png'
    },
    {
      title: 'Приложения',
      subtitle: 'Все необходимые приложения',
      icon: '/settings/vkladka_apps.png'
    },
    {
      title: 'Готово!',
      subtitle: 'Ваш телефон настроен',
      icon: '/system_setup/WintoPhone_Setup.jpg'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="oobe-container">
      {step === 1 ? (
        <OOBEAgentPinCodes onComplete={handleNext} />
      ) : (
        <div className="oobe-step">
          <div className="oobe-icon">
            <img src={steps[step].icon} alt={steps[step].title} />
          </div>
          
          <h1 className="oobe-title">{steps[step].title}</h1>
          <p className="oobe-subtitle">{steps[step].subtitle}</p>
          
          <div className="oobe-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`oobe-dot ${index === step ? 'active' : ''}`}
              />
            ))}
          </div>
          
          <div className="oobe-buttons">
            {step > 0 && (
              <button className="oobe-button secondary" onClick={handleBack}>
                Назад
              </button>
            )}
            <button className="oobe-button primary" onClick={handleNext}>
              {step === steps.length - 1 ? 'Начать' : 'Далее'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOOBE;