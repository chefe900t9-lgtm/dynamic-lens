import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Cpu, Filter } from "lucide-react";

interface ActiveFiltersDisplayProps {
  regional?: string;
  uf?: string;
  tecnologia?: string;
  subcategoria?: string;
  tipoAcesso?: string;
  tipoReclamacao?: string;
  dateFrom?: Date;
  dateTo?: Date;
  totalRecords: number;
}

export const ActiveFiltersDisplay = ({
  regional,
  uf,
  tecnologia,
  subcategoria,
  tipoAcesso,
  tipoReclamacao,
  dateFrom,
  dateTo,
  totalRecords,
}: ActiveFiltersDisplayProps) => {
  const hasFilters = regional || uf || tecnologia || subcategoria || tipoAcesso || tipoReclamacao || dateFrom || dateTo;

  if (!hasFilters) return null;

  const formatDateRange = () => {
    if (!dateFrom && !dateTo) return null;
    
    const fromStr = dateFrom ? format(dateFrom, "d MMM", { locale: ptBR }) : "Início";
    const toStr = dateTo ? format(dateTo, "d MMM yyyy", { locale: ptBR }) : "Hoje";
    
    return `${fromStr} - ${toStr}`;
  };

  const dateRange = formatDateRange();

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filtros ativos:</span>
      </div>
      
      {dateRange && (
        <Badge variant="secondary" className="gap-1">
          <Calendar className="h-3 w-3" />
          {dateRange}
        </Badge>
      )}
      
      {regional && (
        <Badge variant="secondary" className="gap-1">
          <MapPin className="h-3 w-3" />
          {regional}
        </Badge>
      )}
      
      {uf && (
        <Badge variant="secondary">
          UF: {uf}
        </Badge>
      )}
      
      {tecnologia && (
        <Badge variant="secondary" className="gap-1">
          <Cpu className="h-3 w-3" />
          {tecnologia}
        </Badge>
      )}
      
      {subcategoria && (
        <Badge variant="secondary">
          {subcategoria}
        </Badge>
      )}
      
      {tipoAcesso && (
        <Badge variant="secondary">
          {tipoAcesso}
        </Badge>
      )}
      
      {tipoReclamacao && (
        <Badge variant="secondary">
          {tipoReclamacao}
        </Badge>
      )}
      
      <div className="ml-auto text-sm font-medium">
        {totalRecords.toLocaleString()} registros
      </div>
    </div>
  );
};
