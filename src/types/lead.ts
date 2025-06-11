
export interface Lead {
  id: number;
  created_at: string;
  email_lead: string | null;
  email_closer: string | null;
  dateTime: string | null;
  tentativas: string | null;
  'atendido?': string | null;  // Note the question mark in the database field name
  'Reuniao_marcada?': string | null;  // Note the question mark in the database field name
  Duracao?: number | null;
  Custo_total?: number | null;
  Data_horario_ligação?: string | null;
  Resumo_ligação?: string | null;
  Sentimento_do_usuário?: string | null;
  Nome?: string | null;
  Numero?: string | null;
}
