interface PinCodeData {
  type: 'pin' | 'pattern';
  pin?: string;
  pattern?: number[];
  createdAt: number;
}

const STORAGE_KEY = 'wintophone_security';

export const PinCodes = {
  save: (data: PinCodeData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  load: (): PinCodeData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  hasSecurity: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  verifyPin: (inputPin: string): boolean => {
    const data = PinCodes.load();
    if (!data || data.type !== 'pin') return false;
    return data.pin === inputPin;
  },

  verifyPattern: (inputPattern: number[]): boolean => {
    const data = PinCodes.load();
    if (!data || data.type !== 'pattern') return false;
    return JSON.stringify(data.pattern) === JSON.stringify(inputPattern);
  }
};

export default PinCodes;