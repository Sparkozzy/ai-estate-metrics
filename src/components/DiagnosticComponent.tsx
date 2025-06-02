
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const DiagnosticComponent = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Diagnóstico: Fazendo requisição ao Supabase...');
        
        const { data: result, error: queryError } = await supabase
          .from('Retell_Leads')
          .select('*')
          .limit(5);

        console.log('📊 Dados brutos do Supabase:', result);
        console.log('❌ Erro (se houver):', queryError);

        if (queryError) {
          console.error('❌ Erro na consulta:', queryError);
          setError(queryError);
        } else {
          console.log('✅ Dados carregados com sucesso:', result);
          setData(result);
        }
      } catch (err) {
        console.error('💥 Erro inesperado:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 Dados carregados do Supabase</h1>
      
      {loading && (
        <div className="text-blue-600 font-medium">
          ⏳ Carregando dados da tabela Retell_Leads...
        </div>
      )}

      {error && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-red-600 mb-3">❌ Erro na consulta:</h2>
          <pre className="bg-black text-white p-4 rounded-lg overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {!loading && !error && (!data || data.length === 0) && (
        <div className="text-yellow-600 font-medium">
          ⚠️ Nenhum dado foi retornado da tabela Retell_Leads
        </div>
      )}

      {!loading && !error && data && data.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-green-600 mb-3">
            ✅ Dados encontrados ({data.length} registros):
          </h2>
          <pre className="bg-black text-white p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">ℹ️ Informações de Debug:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Tabela consultada: <code>Retell_Leads</code></li>
          <li>• Limite de registros: 5</li>
          <li>• Verifique o console do navegador para logs detalhados</li>
          <li>• Se não há dados: verifique permissões RLS ou se a tabela tem registros</li>
          <li>• Se há erro: verifique configuração do Supabase</li>
        </ul>
      </div>
    </div>
  );
};

export default DiagnosticComponent;
