
export interface SimulationState {
  lightIntensity: number; // 0 - 100
  co2Level: number; // 0 - 100
  temperature: number; // 0 - 50 (°C)
  isSimulating: boolean;
}

export interface DataPoint {
  time: number;
  rate: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
