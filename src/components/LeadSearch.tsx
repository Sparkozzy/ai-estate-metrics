
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Lead } from '@/lib/supabase';

interface LeadSearchProps {
  leads: Lead[];
  onSelectLead: (lead: Lead | null) => void;
  selectedLead: Lead | null;
}

const LeadSearch: React.FC<LeadSearchProps> = ({ leads, onSelectLead, selectedLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = leads.filter(lead =>
        lead.email_lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.id.toString().includes(searchTerm)
      );
      setFilteredLeads(filtered);
      setShowResults(true);
    } else {
      setFilteredLeads([]);
      setShowResults(false);
    }
  }, [searchTerm, leads]);

  const handleSelectLead = (lead: Lead) => {
    onSelectLead(lead);
    setSearchTerm(lead.email_lead);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSelectLead(null);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar por email ou ID do lead..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && filteredLeads.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredLeads.slice(0, 10).map((lead) => (
            <div
              key={lead.id}
              onClick={() => handleSelectLead(lead)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-sm text-gray-900">{lead.email_lead}</div>
              <div className="text-xs text-gray-500">ID: {lead.id}</div>
            </div>
          ))}
        </div>
      )}

      {showResults && filteredLeads.length === 0 && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
          <div className="text-sm text-gray-500">Nenhum lead encontrado</div>
        </div>
      )}
    </div>
  );
};

export default LeadSearch;
