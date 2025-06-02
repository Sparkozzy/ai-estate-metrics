
import React from 'react';
import { X, User, Mail, Phone, Target, Clock, DollarSign, MessageSquare, Heart } from 'lucide-react';
import { Lead } from '@/lib/supabase';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const formatDuration = (duration: number) => {
    if (!duration || duration === 0) return "—";
    return `${Math.round(duration / 60)} min`;
  };

  const formatCost = (cost: number) => {
    if (!cost || cost === 0) return "—";
    return `$${(cost / 100).toFixed(2)}`;
  };

  const formatValue = (value: string | undefined | null) => {
    return value && value.trim() !== '' ? value : "—";
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Lead</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Lead Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informações Básicas
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-500">Nome:</span>
                <p className="text-sm font-medium text-gray-900">{formatValue(lead.nome)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">E-mail:</span>
                <p className="text-sm text-gray-900">{formatValue(lead.email_lead)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Número:</span>
                <p className="text-sm text-gray-900">{formatValue(lead.numero)}</p>
              </div>
            </div>
          </div>

          {/* Contact Stats */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Estatísticas de Contato
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">Tentativas:</span>
                <p className="text-lg font-bold text-blue-600">{lead.tentativas}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Atendido:</span>
                <p className={`text-sm font-medium ${lead.atendido ? 'text-green-600' : 'text-red-600'}`}>
                  {lead.atendido ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>
          </div>

          {/* Call Details */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Detalhes da Chamada
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Duração:</span>
                <span className="text-sm font-medium text-gray-900">{formatDuration(lead.duracao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Custo:</span>
                <span className="text-sm font-medium text-gray-900">{formatCost(lead.custo_total)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Reunião marcada:</span>
                <p className="text-sm text-gray-900">{formatValue(lead.reuniao_marcada)}</p>
              </div>
            </div>
          </div>

          {/* Sentiment */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Análise de Sentimento
            </h3>
            <p className="text-sm text-gray-900">{formatValue(lead.sentimento_usuario)}</p>
          </div>

          {/* Call Summary */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Resumo da Ligação
            </h3>
            <p className="text-sm text-gray-900 leading-relaxed">{formatValue(lead.resumo_ligacao)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPanel;
