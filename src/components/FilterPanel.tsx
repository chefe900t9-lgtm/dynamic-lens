import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { DateRangeFilter } from "./DateRangeFilter";

interface FilterPanelProps {
  regionals: string[];
  ufs: string[];
  tecnologias: string[];
  subcategorias: string[];
  tiposAcesso: string[];
  tiposReclamacao: string[];
  selectedRegional?: string;
  selectedUF?: string;
  selectedTecnologia?: string;
  selectedSubcategoria?: string;
  selectedTipoAcesso?: string;
  selectedTipoReclamacao?: string;
  onRegionalChange: (value: string) => void;
  onUFChange: (value: string) => void;
  onTecnologiaChange: (value: string) => void;
  onSubcategoriaChange: (value: string) => void;
  onTipoAcessoChange: (value: string) => void;
  onTipoReclamacaoChange: (value: string) => void;
  onDateChange?: (from: Date | undefined, to: Date | undefined) => void;
  onReset: () => void;
}

export const FilterPanel = ({
  regionals,
  ufs,
  tecnologias,
  subcategorias,
  tiposAcesso,
  tiposReclamacao,
  selectedRegional,
  selectedUF,
  selectedTecnologia,
  selectedSubcategoria,
  selectedTipoAcesso,
  selectedTipoReclamacao,
  onRegionalChange,
  onUFChange,
  onTecnologiaChange,
  onSubcategoriaChange,
  onTipoAcessoChange,
  onTipoReclamacaoChange,
  onDateChange,
  onReset,
}: FilterPanelProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4 text-primary" />
        Filtros:
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Regional:</label>
        <Select value={selectedRegional} onValueChange={onRegionalChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Todas as regionais</SelectItem>
            {regionals.map((regional) => (
              <SelectItem key={regional} value={regional}>
                {regional}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">UF:</label>
        <Select value={selectedUF} onValueChange={onUFChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">Todos os estados</SelectItem>
            {ufs.map((uf) => (
              <SelectItem key={uf} value={uf}>
                {uf}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Tecnologia:</label>
        <Select value={selectedTecnologia} onValueChange={onTecnologiaChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todas</SelectItem>
            {tecnologias.map((tec) => (
              <SelectItem key={tec} value={tec}>
                {tec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Subcategoria:</label>
        <Select value={selectedSubcategoria} onValueChange={onSubcategoriaChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todas</SelectItem>
            {subcategorias.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Tipo Acesso:</label>
        <Select value={selectedTipoAcesso} onValueChange={onTipoAcessoChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todos</SelectItem>
            {tiposAcesso.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Tipo Reclamação:</label>
        <Select value={selectedTipoReclamacao} onValueChange={onTipoReclamacaoChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">Todos</SelectItem>
            {tiposReclamacao.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">Período:</label>
        <DateRangeFilter onDateChange={onDateChange} />
      </div>

      {(selectedRegional || selectedUF || selectedTecnologia || selectedSubcategoria || selectedTipoAcesso || selectedTipoReclamacao) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1 ml-auto"
        >
          <X className="h-3 w-3" />
          Limpar
        </Button>
      )}
    </div>
  );
};
