

import { supabase } from '@/integrations/supabase/client'

export { supabase }

export interface Lead {
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
  sentimento_do_usuario?: string;
  resumo_ligacao?: string;
}

// Helper function to transform Supabase data to our Lead interface
export const transformSupabaseToLead = (supabaseData: any): Lead => {
  return {
    id: supabaseData.id,
    created_at: supabaseData.created_at,
    email_lead: supabaseData.email_lead || '',
    email_closer: supabaseData.email_closer || '—',
    dateTime: supabaseData.dateTime || '—',
    tentativas: supabaseData.tentativas ? parseInt(supabaseData.tentativas) : null,
    atendido: supabaseData['atendido?'] === 'true' || supabaseData['atendido?'] === true,
    reuniao_marcada: supabaseData['Reuniao_marcada?'] || '—',
    duracao: supabaseData.Duracao,
    custo_total: supabaseData.Custo_total,
    data_horario_ligacao: supabaseData['Data_horario_ligação'],
    sentimento_do_usuario: supabaseData['Sentimento_do_usuário'],
    resumo_ligacao: supabaseData['Resumo_ligação']
  };
};

