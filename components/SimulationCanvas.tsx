
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SimulationState } from '../types';

interface Props {
  state: SimulationState;
  rate: number;
}

const SimulationCanvas: React.FC<Props> = ({ state, rate }) => {
  const [activeEffect, setActiveEffect] = useState<'light' | 'co2' | 'temp' | null>(null);
  const prevState = useRef(state);

  useEffect(() => {
    const diffLight = Math.abs(state.lightIntensity - prevState.current.lightIntensity);
    const diffCo2 = Math.abs(state.co2Level - prevState.current.co2Level);
    const diffTemp = Math.abs(state.temperature - prevState.current.temperature);

    let timer: number;
    if (diffLight > 8) {
      setActiveEffect('light');
      prevState.current = state;
    } else if (diffCo2 > 8) {
      setActiveEffect('co2');
      prevState.current = state;
    } else if (diffTemp > 3) {
      setActiveEffect('temp');
      prevState.current = state;
    }

    if (diffLight > 8 || diffCo2 > 8 || diffTemp > 3) {
      timer = window.setTimeout(() => setActiveEffect(null), 800);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const particleCount = Math.floor(rate / 5) + 1;
  const particles = useMemo(() => Array.from({ length: Math.min(particleCount, 15) }), [particleCount]);

  const sunScale = 0.4 + (state.lightIntensity / 100) * 0.4;
  const tempTintColor = state.temperature > 30 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)';

  return (
    <div 
      className="relative w-full h-64 sm:h-80 bg-gradient-to-b from-blue-100 to-green-50 rounded-[2rem] overflow-hidden shadow-inner border-2 border-green-100 transition-colors duration-1000"
      style={{ '--tint-color': tempTintColor } as React.CSSProperties}
    >
      <div className={`absolute inset-0 z-10 pointer-events-none ${activeEffect === 'temp' ? 'animate-temp-tint' : ''}`} />

      {/* Sun */}
      <div 
        className={`absolute top-4 right-4 transition-transform duration-500 z-20 ${activeEffect === 'light' ? 'scale-110 blur-[1px]' : ''}`}
        style={{ transform: `scale(${sunScale})` }}
      >
        <div className={`w-14 h-14 sm:w-20 sm:h-20 bg-yellow-400 rounded-full shadow-[0_0_40px_rgba(250,204,21,0.5)] relative transition-all ${activeEffect === 'light' ? 'bg-white brightness-125' : ''}`}>
           {[...Array(8)].map((_, i) => (
             <div 
               key={i} 
               className="sun-ray absolute bg-yellow-300 w-1 h-6 sm:h-8 rounded-full top-1/2 left-1/2"
               style={{ 
                 transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-35px)`,
                 opacity: activeEffect === 'light' ? 1 : 0.6
               }}
             />
           ))}
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-12 sm:h-16 bg-amber-800/10" />

      {/* Plant Drawing */}
      <div className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transition-all ${activeEffect === 'light' ? 'animate-leaf-glow' : ''}`}>
        <svg width="100" height="140" viewBox="0 0 120 160" className="sm:w-[120px] sm:h-[160px]">
          <path d="M60 160 Q60 80 60 40" stroke="#166534" strokeWidth="6" fill="none" />
          <path 
            d="M60 100 Q85 80 100 100 Q85 120 60 100" 
            fill={activeEffect === 'light' ? '#86efac' : '#22c55e'}
            className="transition-all duration-500"
            style={{ transformOrigin: '60px 100px', transform: `scale(${0.8 + rate/250})` }}
          />
          <path 
            d="M60 120 Q35 100 20 120 Q35 140 60 120" 
            fill={activeEffect === 'light' ? '#4ade80' : '#15803d'}
            className="transition-all duration-500"
            style={{ transformOrigin: '60px 120px', transform: `scale(${0.8 + rate/250})` }}
          />
          <path 
            d="M60 70 Q40 40 10 70 Q40 100 60 70" 
            fill={activeEffect === 'light' ? '#bbf7d0' : '#4ade80'}
            className="transition-all duration-500"
            style={{ transformOrigin: '60px 70px', transform: `scale(${0.8 + rate/250})` }}
          />
        </svg>
      </div>

      {/* Oxygen Bubbles (Output) */}
      {particles.map((_, i) => (
        <div 
          key={`o2-${i}`}
          className={`bubble absolute w-2 h-2 sm:w-3 sm:h-3 border rounded-full transition-colors duration-500 ${
            state.temperature > 35 ? 'bg-orange-100/60 border-orange-300' : 'bg-white/60 border-blue-200'
          }`}
          style={{ 
            left: `${45 + Math.random() * 10}%`, 
            bottom: `${20 + Math.random() * 30}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1.5 + (100 - rate) / 50}s`
          }}
        />
      ))}

      {/* CO2 Entering (Input) */}
      {state.co2Level > 5 && particles.map((_, i) => (
        <div 
          key={`co2-${i}`}
          className={`absolute rounded-full transition-all duration-500 ${
            activeEffect === 'co2' ? 'animate-co2-pulse bg-blue-400/60 w-3 h-3' : 'bg-gray-400/30 w-1.5 h-1.5'
          }`}
          style={{ 
            left: `${Math.random() * 20}%`, 
            top: `${Math.random() * 70}%`,
            transition: 'all 2s linear',
            transform: `translateX(${40 + rate/3}px)`
          }}
        />
      ))}

      <div className="absolute top-4 left-4 sm:bottom-4 sm:top-auto sm:left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-2xl text-[10px] sm:text-xs font-black text-green-800 shadow-sm border border-green-100 z-30">
        速率: <span className="text-sm sm:text-base">{rate.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default SimulationCanvas;
