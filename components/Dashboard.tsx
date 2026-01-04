
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '../types';

interface Props {
  data: DataPoint[];
}

const Dashboard: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-green-50 h-56 sm:h-64">
      <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
        📈 效率变化趋势
      </h3>
      <div className="w-full h-full pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
                dataKey="time" 
                hide 
            />
            <YAxis 
                domain={[0, 100]} 
                width={30}
                tick={{ fontSize: 9, fill: '#9ca3af' }} 
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
                contentStyle={{ fontSize: '11px', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={() => '实时效率'}
                cursor={{ stroke: '#22c55e', strokeWidth: 1 }}
            />
            <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#22c55e" 
                strokeWidth={4} 
                dot={false}
                isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
