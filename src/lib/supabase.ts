
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghayhpwthdbmnpsptcnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXlocHd0aGRibW5wc3B0Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI3MTMsImV4cCI6MjA2MjI4ODcxM30.S2eyQXNn222n7eHMAXIzfAub8dBiWYlOSyXGFo1LIpA';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Lead {
  id: number;
  created_at: string;
  email_lead: string;
  email_closer: string;
  dateTime: string;
  tentativas: number;
  atendido: boolean;
  reuniao_marcada: string;
  duracao: number;
  custo_total: number;
  data_horario_ligacao: string;
  sentimento_usuario: string;
  nome: string;
  numero: string;
  resumo_ligacao: string;
}

export interface SupabaseLeadData {
  id: number;
  created_at: string;
  email_lead?: string;
  email_closer?: string;
  dateTime?: string;
  tentativas?: string | number;
  'atendido?'?: string;
  'Reuniao_marcada?'?: string;
  Duracao?: number;
  Custo_total?: number;
  Data_horario_ligação?: string;
  Sentimento_do_usuário?: string;
  Nome?: string;
  Numero?: string;
  Resumo_ligação?: string;
}

export const transformSupabaseToLead = (supabaseData: SupabaseLeadData): Lead => {
  return {
    id: supabaseData.id,
    created_at: supabaseData.created_at,
    email_lead: supabaseData.email_lead ?? '',
    email_closer: supabaseData.email_closer ?? '—',
    dateTime: supabaseData.dateTime ?? '—',
    tentativas: Number(supabaseData.tentativas ?? 0),
    atendido: supabaseData['atendido?'] === 'true' || supabaseData['atendido?'] === 'Sim',
    reuniao_marcada: supabaseData['Reuniao_marcada?'] ?? '—',
    duracao: Number(supabaseData.Duracao ?? 0),
    custo_total: Number(supabaseData.Custo_total ?? 0),
    data_horario_ligacao: supabaseData.Data_horario_ligação ?? supabaseData.created_at,
    sentimento_usuario: supabaseData.Sentimento_do_usuário ?? "Indefinido",
    nome: supabaseData.Nome ?? '',
    numero: supabaseData.Numero ?? '',
    resumo_ligacao: supabaseData.Resumo_ligação ?? "Sem resumo"
  };
};
