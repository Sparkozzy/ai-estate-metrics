
import React from 'react';
import { X, Mail, Phone, Calendar, Clock, DollarSign, MessageSquare, Heart } from 'lucide-react';
import { Lead } from '@/lib/supabase';

interface LeadDetailsProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    return `${(seconds / 60).toFixed(1)} min`;
  };

  const formatCost = (cents: number | null) => {
    if (!cents) return 'N/A';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '—') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment: string | undefined) => {
    if (!sentiment) return 'text-gray-500';
    const lower = sentiment.toLowerCase();
    if (lower.includes('positivo') || lower.includes('satisfeito')) return 'text-green-600';
    if (lower.includes('negativo') || lower.includes('insatisfeito')) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getSentimentIcon = (sentiment: string | undefined) => {
    if (!sentiment) return null;
    const lower = sentiment.toLowerCase();
    if (lower.includes('positivo') || lower.includes('satisfeito')) return '😊';
    if (lower.includes('negativo') || lower.includes('insatisfeito')) return '😞';
    return '😐';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Detalhes do Lead</h2>
          <p className="text-sm text-gray-500">ID: {lead.id}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Informações de Contato
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium text-gray-900">{lead.email_lead}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Closer:</span>
              <span className="text-sm font-medium text-gray-900">
                {lead.email_closer !== '—' ? lead.email_closer : 'Não atribuído'}
              </span>
            </div>
          </div>
        </div>

        {/* Call Statistics */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            Estatísticas de Chamadas
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tentativas:</span>
              <span className="text-sm font-medium text-gray-900">{lead.tentativas || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Reunião Marcada:</span>
              <span className={`text-sm font-medium ${
                lead.reuniao_marcada === 'Sim' ? 'text-green-600' : 'text-gray-500'
              }`}>
                {lead.reuniao_marcada === 'Sim' ? 'Sim' : 'Não'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Última Ligação:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(lead.data_horario_ligacao || lead.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Call Metrics */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Métricas de Ligação
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Duração:</span>
              <span className="text-sm font-medium text-gray-900">{formatDuration(lead.duracao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Custo:</span>
              <span className="text-sm font-medium text-gray-900">{formatCost(lead.custo_total)}</span>
            </div>
          </div>
        </div>

        {/* Sentiment */}
        {lead.sentimento_do_usuario && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Sentimento do Usuário
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className={`text-sm font-medium ${getSentimentColor(lead.sentimento_do_usuario)}`}>
                {getSentimentIcon(lead.sentimento_do_usuario)} {lead.sentimento_do_usuario}
              </div>
            </div>
          </div>
        )}

        {/* Call Summary */}
        {lead.resumo_ligacao && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Resumo da Ligação
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{lead.resumo_ligacao}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetails;
