
import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const DeveloperReport: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Só exibe em desenvolvimento ou quando há parâmetros de debug
  const isDeveloperMode = window.location.hostname === 'localhost' || 
                          window.location.search.includes('debug=true') ||
                          process.env.NODE_ENV === 'development';

  if (!isDeveloperMode) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <div className="bg-blue-950 text-blue-100 rounded-lg shadow-lg border border-blue-800">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-blue-900 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">Relatório Técnico</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-blue-800">
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-semibold text-blue-200 mb-2">
                  ⚠️ Observação técnica sobre Supabase e dados congelados:
                </h4>
              </div>
              
              <div className="space-y-2 text-blue-100">
                <p>
                  Sempre que o projeto é aberto, ele carrega os dados conforme a última leitura da tabela do Supabase — e essa leitura pode estar sendo cacheada ou não atualizada em tempo real, dependendo do estado da conexão.
                </p>
                
                <p>
                  Quando o dashboard não se conecta automaticamente ao canal em tempo real, ele exibe dados "congelados" até que um evento de sincronização ocorra (como clicar no botão ou forçar reload).
                </p>
                
                <div className="bg-blue-900 p-2 rounded mt-3">
                  <p className="font-medium text-blue-200 mb-1">A solução definitiva foi:</p>
                  <ul className="space-y-1 text-blue-100">
                    <li>• Remover a necessidade de ativação manual</li>
                    <li>• Iniciar a escuta de eventos (on('postgres_changes')) automaticamente no useEffect</li>
                    <li>• Atualizar dinamicamente a visualização ao detectar novas entradas, alterações ou exclusões</li>
                  </ul>
                </div>
                
                <p className="text-blue-200 font-medium">
                  Agora, sempre que o dashboard for aberto, ele se conecta em tempo real e reflete fielmente o estado da base de dados atual.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperReport;
