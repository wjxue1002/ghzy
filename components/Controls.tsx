
import React from 'react';
import { SimulationState } from '../types';

interface Props {
  state: SimulationState;
  onChange: (newState: Partial<SimulationState>) => void;
}

const Controls: React.FC<Props> = ({ state, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Light Intensity */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-green-50 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <span className="text-2xl">☀️</span> 光照强度
          </label>
          <span className="text-sm font-black bg-yellow-50 text-yellow-700 px-3 py-1 rounded-xl border border-yellow-100">
            {state.lightIntensity}%
          </span>
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={state.lightIntensity}
            onChange={(e) => onChange({ lightIntensity: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-yellow-500 touch-pan-y"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium">光子流密度 (PPFD)</p>
      </div>

      {/* CO2 Level */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-green-50 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <span className="text-2xl">☁️</span> CO₂ 浓度
          </label>
          <span className="text-sm font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-100">
            {state.co2Level}%
          </span>
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={state.co2Level}
            onChange={(e) => onChange({ co2Level: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-500 touch-pan-y"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium">空气二氧化碳饱和度</p>
      </div>

      {/* Temperature */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-green-50 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <span className="text-2xl">🌡️</span> 环境温度
          </label>
          <span className="text-sm font-black bg-red-50 text-red-700 px-3 py-1 rounded-xl border border-red-100">
            {state.temperature}°C
          </span>
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={state.temperature}
            onChange={(e) => onChange({ temperature: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-red-500 touch-pan-y"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium">最佳范围: 25-35°C</p>
      </div>
    </div>
  );
};

export default Controls;
