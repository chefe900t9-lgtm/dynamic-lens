import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataRecord } from "@/utils/dataProcessor";

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
      // Buscar com paginação para não ter limite
      let allData: any[] = [];
      let hasMore = true;
      let rangeStart = 0;
      const rangeSize = 1000;

      while (hasMore) {
        let query = supabase
          .from('defeitos')
          .select('*')
          .order('dt_criacao', { ascending: false })
          .range(rangeStart, rangeStart + rangeSize - 1);

        // Aplicar filtros
        if (filters.regional) {
          query = query.eq('regional', filters.regional);
        }
        if (filters.uf) {
          query = query.eq('uf', filters.uf);
        }
        if (filters.tecnologia) {
          query = query.eq('tecnologia', filters.tecnologia);
        }
        if (filters.subcategoria) {
          query = query.eq('desc_subcategoria', filters.subcategoria);
        }
        if (filters.tipoAcesso) {
          query = query.eq('tipo_acesso', filters.tipoAcesso);
        }
        if (filters.tipoReclamacao) {
          query = query.eq('tipo_reclamacao', filters.tipoReclamacao);
        }
        if (filters.descDetalhada) {
          query = query.eq('desc_detalhada', filters.descDetalhada);
        }
        if (filters.causa) {
          query = query.eq('causa', filters.causa);
        }
        if (filters.nivel1) {
          query = query.eq('nivel1', filters.nivel1);
        }
        if (filters.nivel2) {
          query = query.eq('nivel2', filters.nivel2);
        }
        if (filters.nivel3) {
          query = query.eq('nivel3', filters.nivel3);
        }

        // Filtros de data
        if (filters.startDate) {
          query = query.gte('dt_criacao', filters.startDate.toISOString());
        }
        if (filters.endDate) {
          query = query.lte('dt_criacao', filters.endDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar defeitos:', error);
          throw error;
        }

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          rangeStart += rangeSize;
          
          // Se retornou menos que o tamanho da página, não há mais dados
          if (data.length < rangeSize) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      const { data, error } = { data: allData, error: null };

      if (error) {
        console.error('Erro ao buscar defeitos:', error);
        throw error;
      }

      // Transformar dados do Supabase para o formato DataRecord
      const transformedData: DataRecord[] = (data || []).map(item => ({
        DT_CRIACAO: item.dt_criacao,
        DESC_CATEGORIA: item.desc_categoria,
        DESC_SUBCATEGORIA: item.desc_subcategoria,
        DESC_DETALHADA: item.desc_detalhada,
        TECNOLOGIA: item.tecnologia,
        ARMARIO: item.armario,
        TIPO_ACESSO: item.tipo_acesso,
        SUBTECNOLOGIA: item.subtecnologia || '',
        STRG_REDE: item.strg_rede || '',
        TIPO_RECLAMACAO: item.tipo_reclamacao,
        REGIONAL: item.regional,
        UF: item.uf,
        EVENTO_SAS: item.evento_sas || '',
        CAUSA: item.causa || '',
        NIVEL1: item.nivel1 || '',
        NIVEL2: item.nivel2 || '',
        NIVEL3: item.nivel3 || '',
        CAMADA: item.camada || '',
      }));

      return transformedData;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};