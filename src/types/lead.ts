
export interface Lead {
  id: number;
  created_at: string;
  email_lead: string;
  email_closer: string;
  dateTime: string;
  tentativas: string | null;
  atendido: string | null;
  reuniao_marcada: string;
  Duracao?: number;
  Custo_total?: number;
  Data_horario_ligação?: string;
  Resumo_ligação?: string;
  Sentimento_do_usuário?: string;
  Nome?: string;
  Numero?: string;
}
