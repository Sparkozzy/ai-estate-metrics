
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Phone, PhoneCall, Calendar, Target, Clock, BarChart3, DollarSign } from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import PerformanceChart from '../components/PerformanceChart';
import FunnelChart from '../components/FunnelChart';
import HeatmapChart from '../components/HeatmapChart';
import CostDurationChart from '../components/CostDurationChart';
import DateFilter from '../components/DateFilter';
import SearchFilter from '../components/SearchFilter';
import LeadsTable from '../components/LeadsTable';
import LeadDetailPanel from '../components/LeadDetailPanel';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { leads, loading, error } = useLeads();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  // Filter leads based on date and search
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    // Date filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        (lead.nome && lead.nome.toLowerCase().includes(searchLower)) ||
        (lead.email_lead && lead.email_lead.toLowerCase().includes(searchLower)) ||
        (lead.numero && lead.numero.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [leads, dateRange, searchTerm]);

  // Safe calculations
  const totalCalls = filteredLeads.reduce((sum, lead) => sum + (lead.tentativas || 0), 0);
  const answeredCalls = filteredLeads.filter(lead => lead.atendido === true).length;
  const meetingsScheduled = filteredLeads.filter(lead => lead.reuniao_marcada === 'Sim').length;
  
  const answerRate = totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : '0';
  const conversionRate = answeredCalls > 0 ? ((meetingsScheduled / answeredCalls) * 100).toFixed(1) : '0';
  const avgAttempts = filteredLeads.length > 0 ? (totalCalls / filteredLeads.length).toFixed(1) : '0';

  // Safe cost and duration calculations
  const leadsWithDuration = filteredLeads.filter(lead => lead.duracao && lead.duracao > 0);
  const leadsWithCost = filteredLeads.filter(lead => lead.custo_total && lead.custo_total > 0);
  
  const totalCost = leadsWithCost.reduce((sum, lead) => sum + (lead.custo_total || 0), 0);
  const avgCost = leadsWithCost.length > 0 ? (totalCost / leadsWithCost.length / 100).toFixed(2) : '0';
  
  const totalDuration = leadsWithDuration.reduce((sum, lead) => sum + (lead.duracao || 0), 0);
  const totalDurationMinutes = Math.round(totalDuration / 60);
  const avgDuration = leadsWithDuration.length > 0 ? (totalDuration / leadsWithDuration.length / 60).toFixed(1) : '0';

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando dados...</h2>
          <p className="text-gray-500">Aguarde enquanto carregamos as informações dos leads</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

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
        {/* Search and Date Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        {/* Summary Stats */}
        <div className="mb-6 text-sm text-gray-600">
          Exibindo {filteredLeads.length} de {leads.length} leads
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
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
            title="Custo Total"
            value={`$${(totalCost / 100).toFixed(2)}`}
            icon={DollarSign}
            trend="+3%"
            trendUp={false}
            description={`$${avgCost} médio por chamada`}
          />
          <MetricsCard
            title="Duração Total"
            value={`${totalDurationMinutes}min`}
            icon={Clock}
            trend="+5%"
            trendUp={true}
            description={`${avgDuration}min médio por chamada`}
          />
          <MetricsCard
            title="Tentativas/Lead"
            value={avgAttempts}
            icon={Target}
            trend="+2%"
            trendUp={true}
            description="média de tentativas"
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

        {/* Cost and Duration Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cost Evolution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Evolução de Custos</h2>
                <p className="text-sm text-gray-500">Custos diários das ligações</p>
              </div>
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <CostDurationChart leads={filteredLeads} type="cost" />
          </div>

          {/* Duration Evolution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Evolução de Duração</h2>
                <p className="text-sm text-gray-500">Duração diária das ligações</p>
              </div>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <CostDurationChart leads={filteredLeads} type="duration" />
          </div>
        </div>

        {/* Heatmaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lista de Leads</h2>
            <p className="text-sm text-gray-500">Clique em um lead para ver os detalhes</p>
          </div>
          <LeadsTable leads={filteredLeads} onLeadClick={setSelectedLead} />
        </div>
      </main>

      {/* Lead Detail Panel */}
      <LeadDetailPanel 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    </div>
  );
};

export default Index;
