import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengesContext } from './ChallengeContext';

interface CountdownContextData {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  resetCountdown: () => void;
  startCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode
}

export const CountdownContext = createContext({} as CountdownContextData);
let CountdownTimeOut: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(0.1 * 36000);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60); 
  const seconds = time % 60;

  function startCountdown() {
    setIsActive(true);
  }

  useEffect(() => {
    if (isActive && time > 0) {
      CountdownTimeOut = setTimeout(() => {
        setTime(time - 1)
      }, 1000)
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]); 

  function resetCountdown() {
    clearTimeout(CountdownTimeOut);
    setIsActive(false);
    setTime(0.1 * 60);
    setHasFinished(false);
  }

  return (
    <CountdownContext.Provider value={{ minutes, seconds, hasFinished, isActive, resetCountdown, startCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
}
