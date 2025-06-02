
import { useEffect, useState } from 'react';
import { supabase, transformSupabaseToLead, Lead } from '@/lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Retell_Leads')
          .select('*');

        if (error) {
          console.error('Erro ao carregar leads:', error);
          setError(error.message);
        } else if (data) {
          const transformedLeads = data.map(transformSupabaseToLead);
          setLeads(transformedLeads);
          setError(null);
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return { leads, loading, error };
};
