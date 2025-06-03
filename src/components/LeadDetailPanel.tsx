
import React from 'react';
import { X, Mail, Phone, Clock, DollarSign, MessageSquare, Heart, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Lead {
  id: number;
  created_at: string;
  email_lead: string;
  email_closer: string;
  dateTime: string;
  tentativas: string | null;
  'atendido?': string | null;
  'Reuniao_marcada?': string;
  Duracao?: number;
  Custo_total?: number;
  Data_horario_ligação?: string;
  Resumo_ligação?: string;
  Sentimento_do_usuário?: string;
  Nome?: string;
  Numero?: string;
}

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '—') return 'Não disponível';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const formatDuration = (duration: number | null | undefined) => {
    if (!duration || duration === 0) return 'Não disponível';
    const minutes = Math.round(duration / 60);
    return `${minutes} minutos`;
  };

  const formatCost = (cost: number | null | undefined) => {
    if (!cost || cost === 0) return 'Não disponível';
    const dollars = (cost / 100).toFixed(2);
    return `$${dollars}`;
  };

  const getMeetingStatus = (status: string) => {
    if (status === 'Sim') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Reunião marcada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3 mr-1" />
        Sem reunião
      </span>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Detalhes do Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Lead Info */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Informações de Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{lead.email_lead || 'Não disponível'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{lead.Numero || 'Não disponível'}</span>
              </div>
            </div>
          </div>

          {/* Call Statistics */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Estatísticas da Ligação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Phone className="w-3 h-3 mr-1" />
                  Tentativas
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {lead.tentativas || 0}
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Duração
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatDuration(lead.Duracao)}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Custo</h3>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-lg font-semibold text-green-600">
                {formatCost(lead.Custo_total)}
              </span>
            </div>
          </div>

          {/* Meeting Status */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Status da Reunião</h3>
            {getMeetingStatus(lead['Reuniao_marcada?'])}
          </div>

          {/* Last Call Date */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Última Ligação</h3>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-gray-900">
                {formatDate(lead.Data_horario_ligação || lead.created_at)}
              </span>
            </div>
          </div>

          {/* Call Summary */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Resumo da Ligação</h3>
            <div className="flex items-start">
              <MessageSquare className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                {lead.Resumo_ligação || 'Nenhum resumo disponível'}
              </p>
            </div>
          </div>

          {/* User Sentiment */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sentimento do Usuário</h3>
            <div className="flex items-center">
              <Heart className="w-4 h-4 text-pink-600 mr-2" />
              <span className="text-sm text-gray-700">
                {lead.Sentimento_do_usuário || 'Não identificado'}
              </span>
            </div>
          </div>

          {/* Closer Information */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Closer Responsável</h3>
            <div className="text-sm text-gray-700">
              {lead.email_closer !== '—' ? lead.email_closer : 'Não atribuído'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPanel;
