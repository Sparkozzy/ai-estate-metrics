
import { useEffect, useState } from 'react';
import { supabase, transformSupabaseToLead, Lead } from '@/lib/supabase';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data, error } = await supabase
          .from('Retell_Leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao carregar leads:', error);
          setError(error);
        } else if (data) {
          const transformedLeads = data.map(transformSupabaseToLead);
          setLeads(transformedLeads);
        }
      } catch (err) {
        console.error('Erro inesperado ao carregar leads:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  return { leads, loading, error };
};
