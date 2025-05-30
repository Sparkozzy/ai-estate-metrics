
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface FunnelChartProps {
  totalCalls: number;
  answeredCalls: number;
  meetingsScheduled: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ 
  totalCalls, 
  answeredCalls, 
  meetingsScheduled 
}) => {
  const data = [
    {
      name: 'Ligações Realizadas',
      value: totalCalls,
      percentage: 100,
      color: '#3b82f6'
    },
    {
      name: 'Ligações Atendidas',
      value: answeredCalls,
      percentage: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
      color: '#10b981'
    },
    {
      name: 'Reuniões Marcadas',
      value: meetingsScheduled,
      percentage: totalCalls > 0 ? (meetingsScheduled / totalCalls) * 100 : 0,
      color: '#f59e0b'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm text-gray-600">Valor: {data.value}</p>
          <p className="text-sm text-gray-600">Taxa: {data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Visual Funnel */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">{item.value}</span>
                <span className="text-sm text-gray-500 ml-2">({item.percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="relative">
              <div 
                className="h-8 rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: item.color,
                  width: `${Math.max(item.percentage, 10)}%`,
                  opacity: 0.8
                }}
              />
              {index < data.length - 1 && (
                <div className="absolute right-0 top-full mt-1 text-xs text-gray-400">
                  ↓ {((data[index + 1].value / item.value) * 100).toFixed(1)}% conversão
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FunnelChart;
