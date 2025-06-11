export interface Lead {
  id: number;
  created_at: string;
  email_lead: string | null;
  email_closer: string | null;
  dateTime: string | null;
  tentativas: string | null; // No banco é texto, faremos a conversão no código
  atendido: string | null; // No banco é texto ('Sim' ou 'Não'), faremos a conversão
  reuniao_marcada: string | null; // No banco é texto ('Sim' ou 'Não')
  Duracao?: number | null;
  Custo_total?: number | null;
  Data_horario_ligação?: string | null;
  Resumo_ligação?: string | null;
  Sentimento_do_usuário?: string | null;
  Nome?: string | null;
  Numero?: string | null;
}
