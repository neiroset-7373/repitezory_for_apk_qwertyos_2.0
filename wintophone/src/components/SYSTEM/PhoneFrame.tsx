import React from 'react';
import './styles/PhoneFrame.css';

interface PhoneFrameProps {
  children: React.ReactNode;
  theme: string;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, theme }) => {
  return (
    <div className={`phone-frame theme-${theme}`}>
      <div className="phone-bezel">
        <div className="front-camera"></div>
        <div className="screen">
          {children}
        </div>
      </div>
      <div className="phone-side-buttons">
        <div className="button power-button"></div>
        <div className="button volume-up"></div>
        <div className="button volume-down"></div>
      </div>
    </div>
  );
};

export default PhoneFrame;
