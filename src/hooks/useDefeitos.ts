import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataRecord } from "@/utils/dataProcessor";
import multiTechData from "@/data/multi_tech_data.json";

interface FilterOptions {
  regional?: string;
  uf?: string;
  tecnologia?: string;
  subcategoria?: string;
  tipoAcesso?: string;
  tipoReclamacao?: string;
  descDetalhada?: string;
  causa?: string;
  nivel1?: string;
  nivel2?: string;
  nivel3?: string;
  startDate?: Date;
  endDate?: Date;
}

export const useDefeitos = (filters: FilterOptions = {}) => {
  return useQuery({
    queryKey: ['defeitos', filters],
    queryFn: async () => {
      // Como a tabela ainda não existe no banco, usar dados do JSON
      console.log('Usando dados do arquivo JSON');
      return multiTechData as DataRecord[];
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};