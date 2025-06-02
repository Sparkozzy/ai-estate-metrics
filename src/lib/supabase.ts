
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
