import React, { useEffect } from 'react';
import '../styles/SetupScreen.css';

interface SetupScreenProps {
  onComplete: () => void;
  isFirstRun: boolean;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete, isFirstRun, currentSlide, setCurrentSlide }) => {
  const [visible, setVisible] = React.useState(true);
  const [displayedSlide, setDisplayedSlide] = React.useState(0);

  useEffect(() => {
    const durations = isFirstRun 
      ? [9000, 5000] // Первый запуск: setup-1 9 сек, setup-2 5 сек
      : [4000, 4000]; // Последующие: по 4 сек

    const timer = setTimeout(() => {
      if (currentSlide < durations.length - 1) {
        setDisplayedSlide(currentSlide + 1);
        setCurrentSlide(currentSlide + 1);
      } else {
        setVisible(false);
        setTimeout(onComplete, 300);
      }
    }, durations[currentSlide]);

    return () => clearTimeout(timer);
  }, [currentSlide, isFirstRun, onComplete, setCurrentSlide]);

  useEffect(() => {
    setDisplayedSlide(currentSlide);
  }, [currentSlide]);

  if (!visible) return null;

  return (
    <div className="setup-screen">
      <img 
        key={displayedSlide}
        src={displayedSlide === 0 ? "/system_setup/setup-1.png" : "/system_setup/setup-2.jpg"} 
        alt="Setup" 
        className="setup-image" 
      />
    </div>
  );
};

export default SetupScreen;
