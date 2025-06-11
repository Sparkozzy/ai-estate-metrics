
import React from 'react';

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
      color: '#3b82f6',
      width: 100
    },
    {
      name: 'Ligações Atendidas',
      value: answeredCalls,
      percentage: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
      color: '#10b981',
      width: 75
    },
    {
      name: 'Reuniões Marcadas',
      value: meetingsScheduled,
      percentage: totalCalls > 0 ? (meetingsScheduled / totalCalls) * 100 : 0,
      color: '#f59e0b',
      width: 50
    }
  ];

  return (
    <div className="space-y-8">
      {/* Funil Visual Centralizado */}
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={item.name} className="space-y-3">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">{item.name}</div>
              <div className="space-x-2">
                <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                <span className="text-sm text-gray-500">({item.percentage.toFixed(1)}%)</span>
              </div>
            </div>
            
            {/* Barra Centralizada com Largura Decrescente */}
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className="h-12 rounded-lg transition-all duration-500 shadow-sm"
                  style={{ 
                    backgroundColor: item.color,
                    width: `${item.width * 3}px`,
                    opacity: 0.9
                  }}
                />
                
                {/* Indicador de Conversão */}
                {index < data.length - 1 && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-gray-400 mb-1">
                        ↓ {((data[index + 1].value / item.value) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo das Taxas de Conversão */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="text-center text-xs font-medium text-gray-600 mb-3">Taxas de Conversão</div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-gray-500">Taxa de Atendimento</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-amber-600">
              {answeredCalls > 0 ? ((meetingsScheduled / answeredCalls) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-gray-500">Conversão para Reunião</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
