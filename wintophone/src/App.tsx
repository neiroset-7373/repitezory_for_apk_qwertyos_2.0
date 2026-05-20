import { useState, useEffect, useCallback } from 'react';
import './App.css';

interface PinCodeData {
  type: 'pin' | 'pattern';
  pin?: string;
  pattern?: number[];
  createdAt: number;
}

const STORAGE_SECURITY = 'wintophone_security';
const STORAGE_OOBE = 'wintophone_oobe_done';
const STORAGE_FIRST_LAUNCH = 'wintophone_first_launch';

const PinCodes = {
  save: (data: PinCodeData) => localStorage.setItem(STORAGE_SECURITY, JSON.stringify(data)),
  load: (): PinCodeData | null => { try { const d = localStorage.getItem(STORAGE_SECURITY); return d ? JSON.parse(d) : null; } catch { return null; } },
  has: (): boolean => !!localStorage.getItem(STORAGE_SECURITY),
  verifyPin: (pin: string): boolean => { const d = PinCodes.load(); return d?.type === 'pin' && d.pin === pin; },
  verifyPattern: (p: number[]): boolean => { const d = PinCodes.load(); return d?.type === 'pattern' && JSON.stringify(d.pattern) === JSON.stringify(p); },
};

// ===== SPLASH SCREEN =====
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const isFirst = !localStorage.getItem(STORAGE_FIRST_LAUNCH);
  const duration = isFirst ? 10000 : 4000;

  useEffect(() => {
    if (isFirst) localStorage.setItem(STORAGE_FIRST_LAUNCH, 'true');
    const t = setTimeout(onComplete, duration);
    return () => clearTimeout(t);
  }, [onComplete, isFirst, duration]);

  return (
    <div className="splash-screen">
      <img src="/system_setup/WintoPhone_Setup.jpg" alt="WintoPhone" className="splash-image" />
    </div>
  );
};

// ===== OOBE =====
const OOBE = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [securityType, setSecurityType] = useState<'pin' | 'pattern' | null>(null);
  const [pin, setPin] = useState('');
  const [pattern, setPattern] = useState<number[]>([]);
  const [error, setError] = useState('');

  const steps = [
    { title: 'Добро пожаловать', subtitle: 'WintoPhone — ваш новый смартфон', icon: '/logos_for_razine_temi/Logo_WintoPhone_for_black_theme.png' },
    { title: 'Безопасность', subtitle: 'Защитите свой телефон', icon: '/settings/Vkladka_bezopasnost.png' },
    { title: 'Готово!', subtitle: 'Ваш телефон настроен', icon: '/system_setup/WintoPhone_Setup.jpg' },
  ];

  const handlePinComplete = () => {
    if (pin.length !== 4) { setError('Введите 4 цифры'); return; }
    PinCodes.save({ type: 'pin', pin, createdAt: Date.now() });
    localStorage.setItem(STORAGE_OOBE, 'true');
    onComplete();
  };

  const handlePatternComplete = () => {
    if (pattern.length < 4) { setError('Минимум 4 точки'); return; }
    PinCodes.save({ type: 'pattern', pattern, createdAt: Date.now() });
    localStorage.setItem(STORAGE_OOBE, 'true');
    onComplete();
  };

  const skipSecurity = () => {
    localStorage.setItem(STORAGE_OOBE, 'true');
    onComplete();
  };

  if (step === 1 && !securityType) {
    return (
      <div className="oobe-screen">
        <img src={steps[1].icon} alt="" className="oobe-icon" />
        <h1 className="oobe-title">{steps[1].title}</h1>
        <p className="oobe-subtitle">{steps[1].subtitle}</p>
        <div className="oobe-security-options">
          <button className="oobe-security-btn" onClick={() => setSecurityType('pin')}>
            <span className="oobe-security-icon">🔢</span>
            <span>PIN-код</span>
            <span className="oobe-security-desc">4 цифры</span>
          </button>
          <button className="oobe-security-btn" onClick={() => setSecurityType('pattern')}>
            <span className="oobe-security-icon">🔓</span>
            <span>Графический ключ</span>
            <span className="oobe-security-desc">Соедините точки</span>
          </button>
        </div>
        <button className="oobe-skip-btn" onClick={skipSecurity}>Пропустить</button>
        <div className="oobe-dots">{steps.map((_, i) => <div key={i} className={`oobe-dot ${i === step ? 'active' : ''}`} />)}</div>
      </div>
    );
  }

  if (step === 1 && securityType === 'pin') {
    return (
      <div className="oobe-screen">
        <h1 className="oobe-title">Создайте PIN-код</h1>
        <p className="oobe-subtitle">Введите 4 цифры</p>
        <div className="pin-dots">{[0,1,2,3].map(i => <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />)}</div>
        {error && <p className="pin-error">{error}</p>}
        <div className="pin-keypad">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(n => (
            <button key={n||'empty'} className={`pin-key ${n===''?'empty':''}`}
              onClick={() => { if(n==='⌫'){setPin(p=>p.slice(0,-1));setError('')}else if(n!==''&&pin.length<4){setPin(p=>p+n);setError('')}}} disabled={n===''}>
              {n}
            </button>
          ))}
        </div>
        <button className="oobe-btn" onClick={handlePinComplete}>Готово</button>
        <button className="oobe-back-btn" onClick={() => {setSecurityType(null);setPin('');setError('')}}>Назад</button>
      </div>
    );
  }

  if (step === 1 && securityType === 'pattern') {
    return (
      <div className="oobe-screen">
        <h1 className="oobe-title">Нарисуйте ключ</h1>
        <p className="oobe-subtitle">Соедините минимум 4 точки</p>
        {error && <p className="pin-error">{error}</p>}
        <div className="pattern-grid">
          {Array.from({length:9},(_,i)=>(
            <button key={i} className={`pattern-dot ${pattern.includes(i)?'selected':''}`}
              onClick={()=>{if(!pattern.includes(i)){const np=[...pattern,i];setPattern(np);if(np.length>=4){PinCodes.save({type:'pattern',pattern:np,createdAt:Date.now()});localStorage.setItem(STORAGE_OOBE,'true');onComplete()}}}} />
          ))}
        </div>
        <button className="oobe-btn" onClick={handlePatternComplete}>Готово</button>
        <button className="oobe-back-btn" onClick={()=>{setSecurityType(null);setPattern([]);setError('')}}>Назад</button>
      </div>
    );
  }

  return (
    <div className="oobe-screen">
      <img src={steps[step].icon} alt="" className="oobe-icon" />
      <h1 className="oobe-title">{steps[step].title}</h1>
      <p className="oobe-subtitle">{steps[step].subtitle}</p>
      <div className="oobe-dots">{steps.map((_,i)=><div key={i} className={`oobe-dot ${i===step?'active':''}`} />)}</div>
      <button className="oobe-btn" onClick={()=>{
        if(step<steps.length-1)setStep(step+1);
        else{localStorage.setItem(STORAGE_OOBE,'true');onComplete()}
      }}>{step===steps.length-1?'Начать':'Далее'}</button>
    </div>
  );
};

// ===== LOCK SCREEN =====
const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pin, setPin] = useState('');
  const [pattern, setPattern] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());
  const sec = PinCodes.load();

  useEffect(() => { const t = setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); }, []);

  const handlePinKey = (n: string) => {
    if(n==='⌫'){setPin(p=>p.slice(0,-1));setError('');return}
    if(pin.length>=4)return;
    const np = pin+n; setPin(np); setError('');
    if(np.length===4) setTimeout(()=>{
      if(PinCodes.verifyPin(np))onUnlock();
      else{setError('Неверный PIN');setPin('')}
    },150);
  };

  if (sec?.type === 'pin') {
    return (
      <div className="lock-screen">
        <div className="lock-header">
          <div className="lock-time">{time.getHours().toString().padStart(2,'0')}:{time.getMinutes().toString().padStart(2,'0')}</div>
          <div className="lock-date">{time.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
        <p className="lock-prompt">Введите PIN-код</p>
        <div className="pin-dots">{[0,1,2,3].map(i=><div key={i} className={`pin-dot ${pin.length>i?'filled':''}`} />)}</div>
        {error&&<p className="pin-error">{error}</p>}
        <div className="pin-keypad">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(n=>(
            <button key={n||'e'} className={`pin-key ${n===''?'empty':''}`} onClick={()=>handlePinKey(String(n))} disabled={n===''}>{n}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lock-screen">
      <div className="lock-header">
        <div className="lock-time">{time.getHours().toString().padStart(2,'0')}:{time.getMinutes().toString().padStart(2,'0')}</div>
        <div className="lock-date">{time.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}</div>
      </div>
      <p className="lock-prompt">Нарисуйте ключ</p>
      {error&&<p className="pin-error">{error}</p>}
      <div className="pattern-grid">
        {Array.from({length:9},(_,i)=>(
          <button key={i} className={`pattern-dot ${pattern.includes(i)?'selected':''}`}
            onClick={()=>{if(pattern.includes(i))return;const np=[...pattern,i];setPattern(np);if(np.length>=4){setTimeout(()=>{if(PinCodes.verifyPattern(np))onUnlock();else{setError('Неверный ключ');setPattern([])}},200)}}} />
        ))}
      </div>
      <button className="oobe-back-btn" onClick={()=>setPattern([])}>Сбросить</button>
    </div>
  );
};

// ===== HOME SCREEN =====
const HomeScreen = ({ onOpenApp, onLock }: { onOpenApp: (id: string) => void; onLock: () => void }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); }, []);

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

  return (
    <div className="home-screen">
      <div className="status-bar">
        <span>{time.getHours().toString().padStart(2,'0')}:{time.getMinutes().toString().padStart(2,'0')}</span>
        <div className="status-bar-right">
          <button className="lock-btn" onClick={onLock}>🔒</button>
          <span>📶</span><span>🔋</span>
        </div>
      </div>
      <div className="home-content">
        <div className="clock-widget">
          <div className="clock-time">{time.getHours().toString().padStart(2,'0')}:{time.getMinutes().toString().padStart(2,'0')}</div>
          <div className="clock-date">{time.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
        <div className="apps-grid">
          {apps.map(app=>(
            <button key={app.id} className="app-btn" onClick={()=>onOpenApp(app.id)}>
              <img src={app.icon} alt={app.name} className="app-icon-img" />
              <span className="app-label">{app.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="dock">
        {dockApps.map(app=>(
          <button key={app.id} className="dock-btn" onClick={()=>onOpenApp(app.id)}>
            <img src={app.icon} alt="" className="dock-icon-img" />
          </button>
        ))}
      </div>
      <div className="home-indicator" />
    </div>
  );
};

// ===== APP =====
function App() {
  const [phase, setPhase] = useState<'splash'|'oobe'|'lock'|'home'|'app'>('splash');
  const [activeApp, setActiveApp] = useState<string|null>(null);

  const handleSplashDone = useCallback(()=>{
    if(localStorage.getItem(STORAGE_OOBE)){
      if(PinCodes.has())setPhase('lock'); else setPhase('home');
    } else setPhase('oobe');
  },[]);

  const handleOOBEDone = useCallback(()=>{
    if(PinCodes.has())setPhase('lock'); else setPhase('home');
  },[]);

  const handleOpenApp = useCallback((id:string)=>{
    setActiveApp(id); setPhase('app');
  },[]);

  const handleCloseApp = useCallback(()=>{
    setActiveApp(null); setPhase('home');
  },[]);

  const handleLock = useCallback(()=>{
    setActiveApp(null); setPhase('lock');
  },[]);

  const appNames: Record<string,string> = {
    phone:'Телефон',messages:'Сообщения',camera:'Камера',gallery:'Галерея',
    music:'Музыка',browser:'Браузер',calculator:'Калькулятор',notes:'Заметки',
    settings:'Настройки',qwerty:'Qwerty Apps'
  };

  return (
    <div className="phone-frame">
      {phase==='splash' && <SplashScreen onComplete={handleSplashDone} />}
      {phase==='oobe' && <OOBE onComplete={handleOOBEDone} />}
      {phase==='lock' && <LockScreen onUnlock={()=>setPhase('home')} />}
      {phase==='home' && <HomeScreen onOpenApp={handleOpenApp} onLock={handleLock} />}
      {phase==='app' && (
        <div className="app-view">
          <div className="app-header-bar">
            <button className="back-btn" onClick={handleCloseApp}>←</button>
            <span className="app-title-text">{appNames[activeApp||'']||'Приложение'}</span>
            <div style={{width:32}} />
          </div>
          <div className="app-placeholder-content">
            <img src="/apps_icons/system/logo_app.png" alt="" className="app-placeholder-logo" />
            <p className="app-placeholder-name">{appNames[activeApp||'']||'Приложение'}</p>
            <p className="app-placeholder-hint">Раздел в разработке</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;