
import React, { useState, useEffect } from 'react';
import { Search, Calendar, TrendingUp, Users, Clock, Target } from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import PerformanceChart from '../components/PerformanceChart';
import LeadsTable from '../components/LeadsTable';
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
    tentativas: null,
    atendido: null,
    reuniao_marcada: 'Sim'
  },
  {
    id: 2,
    created_at: '2025-05-29T20:27:13',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: null,
    reuniao_marcada: '—'
  },
  {
    id: 3,
    created_at: '2025-05-29T20:27:31',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: null,
    reuniao_marcada: '—'
  },
  {
    id: 4,
    created_at: '2025-05-29T20:29:01',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: null,
    reuniao_marcada: '—'
  },
  {
    id: 5,
    created_at: '2025-05-29T20:31:18',
    email_lead: 'fafc.mkt@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: null,
    reuniao_marcada: '—'
  }
];

const Index = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const { toast } = useToast();

  // Calculate metrics
  const totalLeads = filteredLeads.length;
  const leadsWithAttempts = filteredLeads.filter(lead => lead.tentativas > 0).length;
  const meetingsScheduled = filteredLeads.filter(lead => lead.reuniao_marcada === 'Sim').length;
  const conversionRate = totalLeads > 0 ? ((meetingsScheduled / totalLeads) * 100).toFixed(1) : '0';

  // Filter leads based on search and date
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.email_lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email_closer && lead.email_closer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    setFilteredLeads(filtered);
  }, [searchTerm, dateRange, leads]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new lead coming in
      if (Math.random() > 0.95) {
        const newLead = {
          id: leads.length + 1,
          created_at: new Date().toISOString(),
          email_lead: `lead${Date.now()}@example.com`,
          email_closer: '—',
          dateTime: '—',
          tentativas: 0,
          atendido: null,
          reuniao_marcada: '—'
        };
        setLeads(prev => [newLead, ...prev]);
        toast({
          title: "Novo Lead Recebido",
          description: `Lead: ${newLead.email_lead}`,
          duration: 3000,
        });
      }
    }, 10000);

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
                <p className="text-sm text-gray-500">Análise de Performance em Tempo Real</p>
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
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por email do lead ou closer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total de Leads"
            value={totalLeads}
            icon={Users}
            trend="+12%"
            trendUp={true}
            description="vs. semana anterior"
          />
          <MetricsCard
            title="Tentativas de Contato"
            value={leadsWithAttempts}
            icon={Clock}
            trend="+8%"
            trendUp={true}
            description="leads contatados"
          />
          <MetricsCard
            title="Reuniões Marcadas"
            value={meetingsScheduled}
            icon={Calendar}
            trend="+15%"
            trendUp={true}
            description="conversões realizadas"
          />
          <MetricsCard
            title="Taxa de Conversão"
            value={`${conversionRate}%`}
            icon={Target}
            trend="+3.2%"
            trendUp={true}
            description="eficiência geral"
          />
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Evolução Semanal</h2>
              <p className="text-sm text-gray-500">Performance dos últimos 7 dias</p>
            </div>
          </div>
          <PerformanceChart leads={filteredLeads} />
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Leads Recentes</h2>
                <p className="text-sm text-gray-500">Últimas atividades do agente IA</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Atualização automática</span>
              </div>
            </div>
          </div>
          <LeadsTable leads={filteredLeads} />
        </div>
      </main>
    </div>
  );
};

export default Index;
