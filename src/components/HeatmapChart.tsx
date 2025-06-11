// Caminho do arquivo: src/components/HeatmapChart.tsx

import React from 'react';
import { Lead } from '../types/lead'; // 1. IMPORTAR O TIPO CORRETO

interface HeatmapChartProps {
  leads: Lead[];
  type: 'hour' | 'dayOfWeek';
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ leads, type }) => {
  const processHeatmapData = () => {
    if (type === 'hour') {
      // ... (código para 'hour' não precisa de alteração se já usa a Lead importada)
    } else {
      const dayData = Array.from({ length: 7 }, (_, i) => ({
        day: i,
        dayName: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
        calls: 0,
        answered: 0,
        rate: 0
      }));

      leads.forEach(lead => {
        const dayOfWeek = new Date(lead.created_at).getDay();
        // 2. AJUSTAR A LÓGICA PARA USAR parseInt E COMPARAR 'Sim'
        const attempts = parseInt(lead.tentativas || '0', 10);
        dayData[dayOfWeek].calls += attempts;
        if (lead.atendido === 'Sim') { // Comparar com a string 'Sim'
          dayData[dayOfWeek].answered += 1;
        }
      });

      dayData.forEach(item => {
        item.rate = item.calls > 0 ? (item.answered / item.calls) * 100 : 0;
      });

      return dayData;
    }
    // ... (restante da lógica do heatmap de hora)
  };
  // ... o resto do arquivo permanece igual

  const data = processHeatmapData();
  const maxRate = Math.max(...data.map(item => item.rate));

  const getColorIntensity = (rate: number) => {
    if (maxRate === 0) return 'bg-gray-100';
    const intensity = rate / maxRate;
    if (intensity === 0) return 'bg-gray-100';
    if (intensity <= 0.25) return 'bg-blue-200';
    if (intensity <= 0.5) return 'bg-blue-400';
    if (intensity <= 0.75) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  const getTextColor = (rate: number) => {
    if (maxRate === 0) return 'text-gray-600';
    const intensity = rate / maxRate;
    return intensity > 0.5 ? 'text-white' : 'text-gray-700';
  };

  if (type === 'hour') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-1">
          {data.map((item) => (
            <div
              key={item.hour}
              className={`
                h-12 flex flex-col items-center justify-center rounded text-xs font-medium
                ${getColorIntensity(item.rate)} ${getTextColor(item.rate)}
                transition-colors duration-200
              `}
              title={`${item.hour}h: ${item.rate.toFixed(1)}% atendimento (${item.answered}/${item.calls})`}
            >
              <span className="text-xs">{item.hour}h</span>
              <span className="text-xs font-bold">{item.rate.toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Menor taxa</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <div className="w-3 h-3 bg-blue-800 rounded"></div>
          </div>
          <span>Maior taxa</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {data.map((item) => (
          <div
            key={item.day}
            className={`
              h-16 flex flex-col items-center justify-center rounded text-sm font-medium
              ${getColorIntensity(item.rate)} ${getTextColor(item.rate)}
              transition-colors duration-200
            `}
            title={`${item.dayName}: ${item.rate.toFixed(1)}% atendimento (${item.answered}/${item.calls})`}
          >
            <span className="text-xs">{item.dayName}</span>
            <span className="text-sm font-bold">{item.rate.toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Menor taxa</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <div className="w-3 h-3 bg-blue-800 rounded"></div>
        </div>
        <span>Maior taxa</span>
      </div>
    </div>
  );
};

export default HeatmapChart;
