import { useQuery } from "@tanstack/react-query";
import { 
  DataRecord, 
  filterByRegional, 
  filterByUF, 
  filterByTecnologia, 
  filterBySubcategoria, 
  filterByTipoAcesso, 
  filterByTipoReclamacao, 
  filterByPeriod 
} from "@/utils/dataProcessor";
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
      console.log('Aplicando filtros aos dados:', filters);
      
      let result = multiTechData as DataRecord[];
      
      // Aplicar filtros encadeados
      if (filters.regional) {
        result = filterByRegional(result, filters.regional);
      }
      
      if (filters.uf) {
        result = filterByUF(result, filters.uf);
      }
      
      if (filters.tecnologia) {
        result = filterByTecnologia(result, filters.tecnologia);
      }
      
      if (filters.subcategoria) {
        result = filterBySubcategoria(result, filters.subcategoria);
      }
      
      if (filters.tipoAcesso) {
        result = filterByTipoAcesso(result, filters.tipoAcesso);
      }
      
      if (filters.tipoReclamacao) {
        result = filterByTipoReclamacao(result, filters.tipoReclamacao);
      }
      
      // Aplicar filtro de período
      if (filters.startDate || filters.endDate) {
        result = filterByPeriod(result, filters.startDate, filters.endDate);
      }
      
      console.log(`Dados filtrados: ${result.length} registros`);
      return result;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
