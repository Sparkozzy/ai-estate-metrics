
import React, { useState, useEffect } from 'react';
import { TrendingUp, Phone, PhoneCall, Calendar, Target, Clock, BarChart3, DollarSign, Wifi, WifiOff } from 'lucide-react';
import MetricsCard from '../components/MetricsCard';
import PerformanceChart from '../components/PerformanceChart';
import FunnelChart from '../components/FunnelChart';
import HeatmapChart from '../components/HeatmapChart';
import CostDurationChart from '../components/CostDurationChart';
import DateFilter from '../components/DateFilter';
import SearchLeads from '../components/SearchLeads';
import LeadDetailPanel from '../components/LeadDetailPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '../types/lead';

// Updated mock data to match the Lead interface exactly
const mockLeads: Lead[] = [
  {
    id: 1,
    created_at: '2025-05-29T20:21:14',
    email_lead: 'saletemacielrocha@gmail.com',
    email_closer: 'patrick.borges@renatoparanhos.com.br',
    dateTime: '2025-05-28T17:00:00-03:00',
    tentativas: '3',
    'atendido?': 'Sim',
    'Reuniao_marcada?': 'Sim',
    Duracao: 180,
    Custo_total: 45,
    Data_horario_ligação: '2025-05-28T17:00:00-03:00',
    Nome: 'Sales Maciel',
    Numero: '+55119999999',
    Resumo_ligação: 'Interessado no produto',
    Sentimento_do_usuário: 'Positivo'
  },
  {
    id: 2,
    created_at: '2025-05-29T20:27:13',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: '1',
    'atendido?': 'Não',
    'Reuniao_marcada?': '—',
    Duracao: 30,
    Custo_total: 12,
    Data_horario_ligação: '2025-05-29T14:30:00-03:00',
    Nome: 'Ryan F',
    Numero: '+55118888888',
    Resumo_ligação: 'Não atendeu',
    Sentimento_do_usuário: 'Neutro'
  },
  {
    id: 3,
    created_at: '2025-05-29T20:27:31',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: '2',
    'atendido?': 'Sim',
    'Reuniao_marcada?': '—',
    Duracao: 120,
    Custo_total: 25,
    Data_horario_ligação: '2025-05-29T15:15:00-03:00',
    Nome: 'Ryan F',
    Numero: '+55118888888',
    Resumo_ligação: 'Conversou mas não se interessou',
    Sentimento_do_usuário: 'Negativo'
  },
  {
    id: 4,
    created_at: '2025-05-29T20:29:01',
    email_lead: 'fryan3201@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: '1',
    'atendido?': 'Não',
    'Reuniao_marcada?': '—',
    Duracao: 45,
    Custo_total: 15,
    Data_horario_ligação: '2025-05-29T16:00:00-03:00',
    Nome: 'Ryan F',
    Numero: '+55118888888',
    Resumo_ligação: 'Não atendeu',
    Sentimento_do_usuário: 'Neutro'
  },
  {
    id: 5,
    created_at: '2025-05-29T20:31:18',
    email_lead: 'fafc.mkt@gmail.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: '2',
    'atendido?': 'Sim',
    'Reuniao_marcada?': '—',
    Duracao: 210,
    Custo_total: 52,
    Data_horario_ligação: '2025-05-29T16:45:00-03:00',
    Nome: 'FAFC Marketing',
    Numero: '+55117777777',
    Resumo_ligação: 'Interessado mas precisa avaliar',
    Sentimento_do_usuário: 'Positivo'
  },
  {
    id: 6,
    created_at: '2025-05-28T14:30:00',
    email_lead: 'test1@example.com',
    email_closer: 'closer@company.com',
    dateTime: '2025-05-30T10:00:00-03:00',
    tentativas: '2',
    'atendido?': 'Sim',
    'Reuniao_marcada?': 'Sim',
    Duracao: 300,
    Custo_total: 75,
    Data_horario_ligação: '2025-05-28T14:30:00-03:00',
    Nome: 'Teste Um',
    Numero: '+55116666666',
    Resumo_ligação: 'Muito interessado, reunião marcada',
    Sentimento_do_usuário: 'Muito Positivo'
  },
  {
    id: 7,
    created_at: '2025-05-28T16:45:00',
    email_lead: 'test2@example.com',
    email_closer: '—',
    dateTime: '—',
    tentativas: '3',
    'atendido?': 'Não',
    'Reuniao_marcada?': '—',
    Duracao: 60,
    Custo_total: 18,
    Data_horario_ligação: '2025-05-28T16:45:00-03:00',
    Nome: 'Teste Dois',
    Numero: '+55115555555',
    Resumo_ligação: 'Múltiplas tentativas sem sucesso',
    Sentimento_do_usuário: 'Neutro'
  }
];

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(mockLeads);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  const { toast } = useToast();

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadLeadsFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('Retell_Leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading leads:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Usando dados simulados. Verifique a conexão com o Supabase.",
            variant: "destructive",
          });
          return;
        }

        if (data && data.length > 0) {
          console.log('Loaded leads from Supabase:', data);
          setLeads(data);
          setFilteredLeads(data);
        }
      } catch (err) {
        console.error('Error connecting to Supabase:', err);
        toast({
          title: "Erro de conexão",
          description: "Usando dados simulados. Verifique a configuração do Supabase.",
          variant: "destructive",
        });
      }
    };

    loadLeadsFromSupabase();
  }, [toast]);

  // Real-time subscription toggle
  const toggleRealTime = async () => {
    if (isRealTimeEnabled) {
      // Disable real-time
      if (realtimeChannel) {
        await supabase.removeChannel(realtimeChannel);
        setRealtimeChannel(null);
      }
      setIsRealTimeEnabled(false);
      toast({
        title: "Tempo real desabilitado",
        description: "A sincronização automática foi desativada.",
      });
    } else {
      // Enable real-time
      const channel = supabase
        .channel('retell-leads-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Retell_Leads'
          },
          async (payload) => {
            console.log('Real-time update received:', payload);
            
            // Reload all data to ensure consistency
            try {
              const { data, error } = await supabase
                .from('Retell_Leads')
                .select('*')
                .order('created_at', { ascending: false });

              if (!error && data) {
                setLeads(data);
                toast({
                  title: "Dados atualizados",
                  description: "Nova atividade detectada no banco de dados.",
                  duration: 3000,
                });
              }
            } catch (err) {
              console.error('Error reloading data:', err);
            }
          }
        )
        .subscribe((status) => {
          console.log('Real-time subscription status:', status);
          if (status === 'SUBSCRIBED') {
            setIsRealTimeEnabled(true);
            setRealtimeChannel(channel);
            toast({
              title: "Tempo real ativado",
              description: "O dashboard será atualizado automaticamente.",
            });
          } else if (status === 'CHANNEL_ERROR') {
            toast({
              title: "Erro na conexão em tempo real",
              description: "Não foi possível ativar a sincronização automática.",
              variant: "destructive",
            });
          }
        });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [realtimeChannel]);

  // Calculate existing funnel metrics with updated field names
  const totalCalls = filteredLeads.reduce((sum, lead) => sum + (parseInt(lead.tentativas || '0') || 0), 0);
  const answeredCalls = filteredLeads.filter(lead => lead['atendido?'] === 'Sim').length;
  const meetingsScheduled = filteredLeads.filter(lead => lead['Reuniao_marcada?'] === 'Sim').length;
  
  const answerRate = totalCalls > 0 ? ((answeredCalls / totalCalls) * 100).toFixed(1) : '0';
  const conversionRate = answeredCalls > 0 ? ((meetingsScheduled / answeredCalls) * 100).toFixed(1) : '0';
  const avgAttempts = filteredLeads.length > 0 ? (totalCalls / filteredLeads.length).toFixed(1) : '0';

  // Calculate new cost and duration metrics
  const leadsWithDuration = filteredLeads.filter(lead => lead.Duracao != null);
  const leadsWithCost = filteredLeads.filter(lead => lead.Custo_total != null);
  
  const totalCost = leadsWithCost.reduce((sum, lead) => sum + (lead.Custo_total || 0), 0) / 100; // Convert to dollars
  const avgCost = leadsWithCost.length > 0 ? (totalCost / leadsWithCost.length).toFixed(2) : '0';
  
  const totalDuration = leadsWithDuration.reduce((sum, lead) => sum + (lead.Duracao || 0), 0);
  const totalDurationMinutes = Math.floor(totalDuration / 60);
  const avgDuration = leadsWithDuration.length > 0 ? (totalDuration / leadsWithDuration.length / 60).toFixed(1) : '0';

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
        const newLead: Lead = {
          id: leads.length + 1,
          created_at: new Date().toISOString(),
          email_lead: `lead${Date.now()}@example.com`,
          email_closer: '—',
          dateTime: '—',
          tentativas: String(Math.floor(Math.random() * 3) + 1),
          'atendido?': Math.random() > 0.5 ? 'Sim' : 'Não',
          'Reuniao_marcada?': '—',
          Duracao: Math.floor(Math.random() * 240) + 30,
          Custo_total: Math.floor(Math.random() * 60) + 10,
          Data_horario_ligação: new Date().toISOString(),
          Nome: `Lead ${Date.now()}`,
          Numero: `+5511${Math.floor(Math.random() * 100000000)}`,
          Resumo_ligação: 'Tentativa automatizada',
          Sentimento_do_usuário: 'Neutro'
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
            <div className="flex items-center space-x-4">
              <SearchLeads 
                leads={leads}
                onSelectLead={setSelectedLead}
                selectedLead={selectedLead}
              />
              <Button
                onClick={toggleRealTime}
                variant={isRealTimeEnabled ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-2"
              >
                {isRealTimeEnabled ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span>{isRealTimeEnabled ? 'Tempo Real ON' : 'Tempo Real OFF'}</span>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span>{isRealTimeEnabled ? 'Sincronizando' : 'Estático'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${selectedLead ? 'mr-96' : ''}`}>
        {/* Date Filter */}
        <div className="mb-8 flex justify-end">
          <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
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

      {/* Lead Detail Panel */}
      <LeadDetailPanel 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    </div>
  );
};

export default Index;
