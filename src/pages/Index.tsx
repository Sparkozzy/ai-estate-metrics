
import React, { useState, useEffect } from 'react';
import { TrendingUp, Phone, PhoneCall, Calendar, Target, Clock, BarChart3 } from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import PerformanceChart from '../components/PerformanceChart';
import FunnelChart from '../components/FunnelChart';
import HeatmapChart from '../components/HeatmapChart';
import DateFilter from '../components/DateFilter';
import { useToast } from '@/hooks/use-toast';

// Simulated data structure matching Supabase schema
const mockLeads = [
  {
    id: 1,
    created_at: '2025-05-29T20:21:14',
    email_lead: 'saletemacielrocha@gmail.com',
    email_closer: 'patrick.borges@renatoparanhos.com.br',
    dateTime: '2025-05-28T17:00:00-03:00',
    tentativas: 3,
    atendido: true,
    reuniao_marcada: 'Sim'
  },
  {
    id: 2,
    created_at: '2025-05-29T20:27:13',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: false,
    reuniao_marcada: '—'
  },
  {
    id: 3,
    created_at: '2025-05-29T20:27:31',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 2,
    atendido: true,
    reuniao_marcada: '—'
  },
  {
    id: 4,
    created_at: '2025-05-29T20:29:01',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: false,
    reuniao_marcada: '—'
  },
  {
    id: 5,
    created_at: '2025-05-29T20:31:18',
    email_lead: 'fafc.mkt@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 2,
    atendido: true,
    reuniao_marcada: '—'
  },
  // Additional mock data for better analytics
  {
    id: 6,
    created_at: '2025-05-28T14:30:00',
    email_lead: 'test1@example.com',
    email_closer: 'closer@company.com',
    dateTime: '2025-05-30T10:00:00-03:00',
    tentativas: 2,
    atendido: true,
    reuniao_marcada: 'Sim'
  },
  {
    id: 7,
    created_at: '2025-05-28T16:45:00',
    email_lead: 'test2@example.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 3,
    atendido: false,
    reuniao_marcada: '—'
  }
];

const Index = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState(mockLeads);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const { toast } = useToast();

  // Calculate funnel metrics
  const totalCalls = filteredLeads.reduce((sum, lead) => sum + (lead.tentativas || 0), 0);
  const answeredCalls = filteredLeads.filter(lead => lead.atendido === true).length;
  const meetingsScheduled = filteredLeads.filter(lead => lead.reuniao_marcada === 'Sim').length;
  
  const answerRate = totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : '0';
  const conversionRate = answeredCalls > 0 ? ((meetingsScheduled / answeredCalls) * 100).toFixed(1) : '0';
  const avgAttempts = filteredLeads.length > 0 ? (totalCalls / filteredLeads.length).toFixed(1) : '0';
  const totalCallTime = totalCalls * 2; // 2 minutes per call

  // Filter leads based on date
  useEffect(() => {
    let filtered = leads;

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    setFilteredLeads(filtered);
  }, [dateRange, leads]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const newLead = {
          id: leads.length + 1,
          created_at: new Date().toISOString(),
          email_lead: `lead${Date.now()}@example.com`,
          email_closer: '—',
          dateTime: '—',
          tentativas: Math.floor(Math.random() * 3) + 1,
          atendido: Math.random() > 0.5,
          reuniao_marcada: '—'
        };
        setLeads(prev => [newLead, ...prev]);
        toast({
          title: "Nova Atividade do Agente IA",
          description: `Tentativa de contato realizada`,
          duration: 3000,
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [leads.length, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard IA Imobiliário</h1>
                <p className="text-sm text-gray-500">Análise de Performance do Funil de Qualificação</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Conectado</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Filter */}
        <div className="mb-8 flex justify-end">
          <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Ligações Realizadas"
            value={totalCalls}
            icon={Phone}
            trend="+12%"
            trendUp={true}
            description="total de tentativas"
          />
          <MetricsCard
            title="Ligações Atendidas"
            value={answeredCalls}
            icon={PhoneCall}
            trend="+8%"
            trendUp={true}
            description={`${answerRate}% taxa de atendimento`}
          />
          <MetricsCard
            title="Reuniões Marcadas"
            value={meetingsScheduled}
            icon={Calendar}
            trend="+15%"
            trendUp={true}
            description={`${conversionRate}% conversão`}
          />
          <MetricsCard
            title="Tempo Total em Chamadas"
            value={`${totalCallTime}min`}
            icon={Clock}
            trend="+5%"
            trendUp={true}
            description={`${avgAttempts} tentativas/lead`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Funnel Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Funil de Conversão</h2>
                <p className="text-sm text-gray-500">Performance por etapa</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <FunnelChart 
              totalCalls={totalCalls}
              answeredCalls={answeredCalls}
              meetingsScheduled={meetingsScheduled}
            />
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Evolução Semanal</h2>
                <p className="text-sm text-gray-500">Performance dos últimos 7 dias</p>
              </div>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <PerformanceChart leads={filteredLeads} />
          </div>
        </div>

        {/* Heatmaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hour Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Melhores Horários</h2>
                <p className="text-sm text-gray-500">Taxa de atendimento por horário</p>
              </div>
            </div>
            <HeatmapChart leads={filteredLeads} type="hour" />
          </div>

          {/* Day of Week Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Melhores Dias da Semana</h2>
                <p className="text-sm text-gray-500">Taxa de atendimento por dia</p>
              </div>
            </div>
            <HeatmapChart leads={filteredLeads} type="dayOfWeek" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
