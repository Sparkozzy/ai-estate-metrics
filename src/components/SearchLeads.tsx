
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

interface SearchLeadsProps {
  leads: Lead[];
  onSelectLead: (lead: Lead | null) => void;
  selectedLead: Lead | null;
}

const SearchLeads: React.FC<SearchLeadsProps> = ({ leads, onSelectLead, selectedLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase();
    return (
      lead.email_lead?.toLowerCase().includes(term) ||
      lead.email_closer?.toLowerCase().includes(term) ||
      lead.Numero?.toLowerCase().includes(term) ||
      lead.Nome?.toLowerCase().includes(term)
    );
  });

  const handleSelectLead = (lead: Lead) => {
    onSelectLead(lead);
    setSearchTerm(lead.email_lead || '');
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSelectLead(null);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por e-mail, nome ou número..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="pl-10 pr-10"
        />
        {(searchTerm || selectedLead) && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isDropdownOpen && searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {filteredLeads.length > 0 ? (
            filteredLeads.slice(0, 10).map((lead) => (
              <button
                key={lead.id}
                onClick={() => handleSelectLead(lead)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-900">
                  {lead.email_lead}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {lead.id} • Tentativas: {lead.tentativas || 0}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhum lead encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchLeads;
