
import React, { useState, useEffect, useCallback } from 'react';
import { SimulationState, DataPoint } from './types';
import SimulationCanvas from './components/SimulationCanvas';
import Controls from './components/Controls';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    lightIntensity: 50,
    co2Level: 40,
    temperature: 25,
    isSimulating: true,
  });

  const [history, setHistory] = useState<DataPoint[]>([]);
  const [timer, setTimer] = useState(0);

  const calculateRate = useCallback(() => {
    const lightFactor = Math.min(100, state.lightIntensity * 1.5) / 100;
    const co2Factor = Math.min(100, state.co2Level * 2) / 100;
    const tOpt = 30;
    const sigma = 12;
    const tempFactor = Math.max(0, Math.exp(-Math.pow(state.temperature - tOpt, 2) / (2 * Math.pow(sigma, 2))));
    const rawRate = Math.min(lightFactor, co2Factor) * tempFactor * 100;
    return Math.max(0, Math.min(100, rawRate));
  }, [state]);

  const currentRate = calculateRate();

  useEffect(() => {
    if (!state.isSimulating) return;

    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
      setHistory(prev => {
        const newData = [...prev, { time: timer, rate: currentRate }];
        return newData.slice(-20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRate, timer, state.isSimulating]);

  const updateState = (updates: Partial<SimulationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleSimulation = () => {
    setState(prev => ({ ...prev, isSimulating: !prev.isSimulating }));
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-4 md:gap-8">
      <header className="flex flex-col gap-4 border-b border-green-100 pb-4 md:pb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-black text-green-800 tracking-tight leading-tight">
              光合作用互动实验室
            </h1>
            <p className="text-green-600 text-sm md:text-base font-medium">
              探索植物创造能量的奥秘
            </p>
          </div>
          <div className="hidden sm:block">
             <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-green-700 bg-white/50 px-3 py-1.5 rounded-full border border-green-100">
               <span className={`w-2 h-2 rounded-full ${state.isSimulating ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'}`}></span> 
               {state.isSimulating ? '模拟中' : '已暂停'}
             </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={toggleSimulation}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95 text-base sm:text-sm flex-1 sm:flex-none ${
              state.isSimulating 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-green-600 text-white border border-green-700'
            }`}
          >
            {state.isSimulating ? (
              <><span className="text-xl sm:text-lg">⏸️</span> 暂停</>
            ) : (
              <><span className="text-xl sm:text-lg">▶️</span> 继续</>
            )}
          </button>
          <div className="sm:hidden flex items-center justify-center gap-2 text-xs font-bold text-green-700 bg-white/50 px-4 py-2 rounded-xl border border-green-100">
             <span className={`w-2 h-2 rounded-full ${state.isSimulating ? 'bg-yellow-400 animate-pulse' : 'bg-gray-400'}`}></span> 
             {state.isSimulating ? '状态: 正在运行' : '状态: 已暂停'}
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 md:gap-8">
        <SimulationCanvas state={state} rate={currentRate} />
        
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-l-4 border-green-500 pl-3">
            环境参数调节
          </h2>
          <Controls 
            state={state} 
            onChange={updateState} 
          />
          <Dashboard data={history} />
        </section>

        <section className="bg-white/60 backdrop-blur-sm p-5 md:p-6 rounded-3xl border border-green-100 shadow-sm">
           <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
             <span className="text-xl">💡</span> 科学小知识
           </h3>
           <p className="text-sm text-green-700 leading-relaxed">
             光合作用是地球上最重要的生化反应之一。它不仅为植物提供生长所需的糖分，还为几乎所有生物提供了赖以生存的氧气。
             尝试将参数调节到极限，观察植物的变化！
           </p>
        </section>
      </main>

      <footer className="mt-4 pb-8 text-center text-gray-400 text-[10px] md:text-xs">
        © 2024 光合作用互动实验室 · 科学教育演示项目
      </footer>
    </div>
  );
};

export default App;
