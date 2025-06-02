import React, { useState, useEffect } from 'react';
import { TrendingUp, Phone, PhoneCall, Calendar, Target, Clock, BarChart3, DollarSign } from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import PerformanceChart from '../components/PerformanceChart';
import FunnelChart from '../components/FunnelChart';
import HeatmapChart from '../components/HeatmapChart';
import CostDurationChart from '../components/CostDurationChart';
import DateFilter from '../components/DateFilter';
import LeadSearch from '../components/LeadSearch';
import LeadDetails from '../components/LeadDetails';
import DiagnosticComponent from '../components/DiagnosticComponent';
import { useToast } from '@/hooks/use-toast';
import { supabase, Lead, transformSupabaseToLead } from '@/lib/supabase';
import { useLeads } from '@/hooks/useLeads';

const Index = () => {
  const { leads: allLeads, loading, error } = useLeads();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const { toast } = useToast();

  // Filter leads based on date
  useEffect(() => {
    let filtered = allLeads;

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    setFilteredLeads(filtered);
  }, [dateRange, allLeads]);

  // Calculate existing funnel metrics
  const totalCalls = filteredLeads.reduce((sum, lead) => sum + (lead.tentativas || 0), 0);
  const answeredCalls = filteredLeads.filter(lead => lead.atendido === true).length;
  const meetingsScheduled = filteredLeads.filter(lead => lead.reuniao_marcada === 'Sim').length;
  
  const answerRate = totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : '0';
  const conversionRate = answeredCalls > 0 ? ((meetingsScheduled / answeredCalls) * 100).toFixed(1) : '0';
  const avgAttempts = filteredLeads.length > 0 ? (totalCalls / filteredLeads.length).toFixed(1) : '0';

  // Calculate new cost and duration metrics
  const leadsWithDuration = filteredLeads.filter(lead => lead.duracao != null);
  const leadsWithCost = filteredLeads.filter(lead => lead.custo_total != null);
  
  const totalCost = leadsWithCost.reduce((sum, lead) => sum + (lead.custo_total || 0), 0) / 100; // Convert to dollars
  const avgCost = leadsWithCost.length > 0 ? (totalCost / leadsWithCost.length).toFixed(2) : '0';
  
  const totalDuration = leadsWithDuration.reduce((sum, lead) => sum + (lead.duracao || 0), 0);
  const totalDurationMinutes = Math.floor(totalDuration / 60);
  const avgDuration = leadsWithDuration.length > 0 ? (totalDuration / leadsWithDuration.length / 60).toFixed(1) : '0';

  // Supabase real-time subscription
  useEffect(() => {
    const setupSupabaseSubscription = async () => {
      try {
        // Test connection to Supabase with correct table name
        const { data, error } = await supabase.from('Retell_Leads').select('*').limit(1);
        
        if (!error) {
          setIsConnectedToSupabase(true);

          // Setup real-time subscription with correct table name
          const subscription = supabase
            .channel('retell_leads_changes')
            .on('postgres_changes', {
              event: '*',
              schema: 'public',
              table: 'Retell_Leads'
            }, (payload) => {
              console.log('Supabase change detected:', payload);
              
              if (payload.eventType === 'INSERT') {
                const transformedLead = transformSupabaseToLead(payload.new);
                toast({
                  title: "Nova Atividade do Agente IA",
                  description: "Nova tentativa de contato registrada",
                  duration: 3000,
                });
              } else if (payload.eventType === 'UPDATE') {
                toast({
                  title: "Atividade Atualizada",
                  description: "Dados do lead foram atualizados",
                  duration: 3000,
                });
              }
            })
            .subscribe();

          return () => {
            subscription.unsubscribe();
          };
        } else {
          console.log('Supabase not connected, using hook data');
          setIsConnectedToSupabase(false);
        }
      } catch (error) {
        console.log('Supabase connection failed, using hook data:', error);
        setIsConnectedToSupabase(false);
      }
    };

    setupSupabaseSubscription();
  }, [toast]);

  // Show diagnostic view if enabled
  if (showDiagnostic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Diagnóstico do Sistema</h1>
                  <p className="text-sm text-gray-500">Verificação de dados do Supabase</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDiagnostic(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </header>
        <DiagnosticComponent />
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando dados...</h2>
          <p className="text-gray-500">Conectando ao Supabase e carregando leads</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-500 mb-4">Não foi possível conectar ao Supabase</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tentar novamente
            </button>
            <button 
              onClick={() => setShowDiagnostic(true)} 
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Abrir Diagnóstico
            </button>
          </div>
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isConnectedToSupabase ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span>{isConnectedToSupabase ? 'Conectado ao Supabase' : 'Usando dados do Hook'}</span>
              </div>
              <div className="text-sm text-gray-500">
                {filteredLeads.length} leads carregados
              </div>
              <button 
                onClick={() => setShowDiagnostic(true)}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                🔍 Diagnóstico
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Date Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="w-full sm:w-96">
            <LeadSearch 
              leads={filteredLeads} 
              onSelectLead={setSelectedLead}
              selectedLead={selectedLead}
            />
          </div>
          <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Dashboard Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
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
                value={`$${totalCost.toFixed(2)}`}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          </div>

          {/* Lead Details Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              {selectedLead ? (
                <LeadDetails 
                  lead={selectedLead} 
                  onClose={() => setSelectedLead(null)} 
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Buscar Lead</h3>
                  <p className="text-gray-500 text-sm">
                    Use o campo de busca acima para encontrar um lead específico e ver seus detalhes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
