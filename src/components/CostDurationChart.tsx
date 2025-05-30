
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Lead {
  id: number;
  created_at: string;
  email_lead: string;
  email_closer: string;
  dateTime: string;
  tentativas: number | null;
  atendido: boolean | null;
  reuniao_marcada: string;
  duracao?: number | null;
  custo_total?: number | null;
  data_horario_ligacao?: string;
}

interface CostDurationChartProps {
  leads: Lead[];
  type: 'cost' | 'duration';
}

const CostDurationChart: React.FC<CostDurationChartProps> = ({ leads, type }) => {
  // Process data for the last 7 days
  const processChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = leads.filter(lead => {
        const leadDate = lead.data_horario_ligacao 
          ? new Date(lead.data_horario_ligacao).toISOString().split('T')[0]
          : new Date(lead.created_at).toISOString().split('T')[0];
        return leadDate === dateStr;
      });
      
      let value = 0;
      if (type === 'cost') {
        const leadsWithCost = dayLeads.filter(lead => lead.custo_total != null);
        value = leadsWithCost.reduce((sum, lead) => sum + (lead.custo_total || 0), 0) / 100; // Convert to dollars
      } else {
        const leadsWithDuration = dayLeads.filter(lead => lead.duracao != null);
        value = leadsWithDuration.reduce((sum, lead) => sum + (lead.duracao || 0), 0) / 60; // Convert to minutes
      }
      
      last7Days.push({
        date: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
        value: Number(value.toFixed(2)),
        fullDate: dateStr
      });
    }
    
    return last7Days;
  };

  const chartData = processChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{label}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {type === 'cost' 
              ? `Custo: $${data.value}` 
              : `Duração: ${data.value} min`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  const color = type === 'cost' ? '#ef4444' : '#8b5cf6';
  const gradientId = `gradient-${type}`;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => 
              type === 'cost' ? `$${value}` : `${value}min`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostDurationChart;
