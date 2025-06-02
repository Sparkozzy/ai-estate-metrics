
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
import { useToast } from '@/hooks/use-toast';
import { supabase, Lead, transformSupabaseToLead } from '@/lib/supabase';

// Mock data for development (remove when Supabase is connected)
const mockLeads: Lead[] = [
  {
    id: 1,
    created_at: '2025-05-29T20:21:14',
    email_lead: 'saletemacielrocha@gmail.com',
    email_closer: 'patrick.borges@renatoparanhos.com.br',
    dateTime: '2025-05-28T17:00:00-03:00',
    tentativas: 3,
    atendido: true,
    reuniao_marcada: 'Sim',
    duracao: 180,
    custo_total: 45,
    data_horario_ligacao: '2025-05-28T17:00:00-03:00',
    sentimento_do_usuario: 'Positivo - Cliente interessado',
    resumo_ligacao: 'Cliente demonstrou interesse em investimento imobiliário, especialmente em apartamentos na região central. Agendou reunião para próxima semana.'
  },
  {
    id: 2,
    created_at: '2025-05-29T20:27:13',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: false,
    reuniao_marcada: '—',
    duracao: 30,
    custo_total: 12,
    data_horario_ligacao: '2025-05-29T14:30:00-03:00'
  },
  {
    id: 3,
    created_at: '2025-05-29T20:27:31',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 2,
    atendido: true,
    reuniao_marcada: '—',
    duracao: 120,
    custo_total: 25,
    data_horario_ligacao: '2025-05-29T15:15:00-03:00',
    sentimento_do_usuario: 'Neutro',
    resumo_ligacao: 'Cliente atendeu mas não demonstrou interesse no momento. Solicitou contato em 30 dias.'
  },
  {
    id: 4,
    created_at: '2025-05-29T20:29:01',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 1,
    atendido: false,
    reuniao_marcada: '—',
    duracao: 45,
    custo_total: 15,
    data_horario_ligacao: '2025-05-29T16:00:00-03:00'
  },
  {
    id: 5,
    created_at: '2025-05-29T20:31:18',
    email_lead: 'fafc.mkt@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 2,
    atendido: true,
    reuniao_marcada: '—',
    duracao: 210,
    custo_total: 52,
    data_horario_ligacao: '2025-05-29T16:45:00-03:00',
    sentimento_do_usuario: 'Negativo - Não tem interesse',
    resumo_ligacao: 'Cliente informou que não tem interesse em investimentos imobiliários no momento.'
  },
  {
    id: 6,
    created_at: '2025-05-28T14:30:00',
    email_lead: 'test1@example.com',
    email_closer: 'closer@company.com',
    dateTime: '2025-05-30T10:00:00-03:00',
    tentativas: 2,
    atendido: true,
    reuniao_marcada: 'Sim',
    duracao: 300,
    custo_total: 75,
    data_horario_ligacao: '2025-05-28T14:30:00-03:00',
    sentimento_do_usuario: 'Muito positivo',
    resumo_ligacao: 'Excelente conversa! Cliente já possui experiência em investimentos e está pronto para fechar negócio.'
  },
  {
    id: 7,
    created_at: '2025-05-28T16:45:00',
    email_lead: 'test2@example.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: 3,
    atendido: false,
    reuniao_marcada: '—',
    duracao: 60,
    custo_total: 18,
    data_horario_ligacao: '2025-05-28T16:45:00-03:00'
  }
];

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(mockLeads);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);
  const { toast } = useToast();

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
          
          // Fetch initial data
          const { data: initialData } = await supabase
            .from('Retell_Leads')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (initialData) {
            const transformedData = initialData.map(transformSupabaseToLead);
            setLeads(transformedData);
          }

          // Setup real-time subscription
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
                setLeads(prev => [transformedLead, ...prev]);
                toast({
                  title: "Nova Atividade do Agente IA",
                  description: "Nova tentativa de contato registrada",
                  duration: 3000,
                });
              } else if (payload.eventType === 'UPDATE') {
                const transformedLead = transformSupabaseToLead(payload.new);
                setLeads(prev => prev.map(lead => 
                  lead.id === transformedLead.id ? transformedLead : lead
                ));
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
          console.log('Supabase not connected, using mock data');
          setIsConnectedToSupabase(false);
        }
      } catch (error) {
        console.log('Supabase connection failed, using mock data:', error);
        setIsConnectedToSupabase(false);
      }
    };

    setupSupabaseSubscription();
  }, [toast]);

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

  // Mock real-time updates for development
  useEffect(() => {
    if (isConnectedToSupabase) return; // Don't use mock updates if connected to Supabase

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const newLead: Lead = {
          id: leads.length + 1,
          created_at: new Date().toISOString(),
          email_lead: `lead${Date.now()}@example.com`,
          email_closer: '—',
          dateTime: '—',
          tentativas: Math.floor(Math.random() * 3) + 1,
          atendido: Math.random() > 0.5,
          reuniao_marcada: '—',
          duracao: Math.floor(Math.random() * 240) + 30,
          custo_total: Math.floor(Math.random() * 60) + 10,
          data_horario_ligacao: new Date().toISOString()
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
  }, [leads.length, toast, isConnectedToSupabase]);

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
                <span>{isConnectedToSupabase ? 'Conectado ao Supabase' : 'Modo de Desenvolvimento'}</span>
              </div>
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
