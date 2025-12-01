import { useState, useMemo } from "react";
import { MetricCard } from "@/components/MetricCard";
import { DrillDownView } from "@/components/DrillDownView";
import { FilterPanel } from "@/components/FilterPanel";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { RankingCard } from "@/components/RankingCard";
import { useDefeitos } from "@/hooks/useDefeitos";
import { Link } from "react-router-dom";
import { 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  Database, 
  TrendingDown,
  Target,
  Wifi,
  Phone,
  Network,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  aggregateByField,
  getDrillDownData,
  getUniqueValues,
  getTopRegionals,
  getTopArmarios,
  getTopUFs,
  getTopTecnologias,
  getTopSubcategorias,
  getTopTiposAcesso,
} from "@/utils/dataProcessor";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [selectedRegional, setSelectedRegional] = useState<string>();
  const [selectedUF, setSelectedUF] = useState<string>();
  const [selectedTecnologia, setSelectedTecnologia] = useState<string>();
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>();
  const [selectedTipoAcesso, setSelectedTipoAcesso] = useState<string>();
  const [selectedTipoReclamacao, setSelectedTipoReclamacao] = useState<string>();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [drillPath, setDrillPath] = useState<{
    descDetalhada?: string;
    causa?: string;
    nivel1?: string;
    nivel2?: string;
  }>({});

  const [causaDrillPath, setCausaDrillPath] = useState<{
    causa?: string;
    nivel1?: string;
    nivel2?: string;
    nivel3?: string;
  }>({});

  const [nivel1DrillPath, setNivel1DrillPath] = useState<{
    nivel1?: string;
    nivel2?: string;
    nivel3?: string;
  }>({});

  const [nivel2DrillPath, setNivel2DrillPath] = useState<{
    nivel2?: string;
    nivel3?: string;
  }>({});

  const [nivel3DrillPath, setNivel3DrillPath] = useState<{
    nivel3?: string;
  }>({});

  // Buscar dados do backend com filtros básicos (sem drill-down)
  const { data: backendData = [], isLoading, error } = useDefeitos({
    regional: selectedRegional && selectedRegional !== "all" ? selectedRegional : undefined,
    uf: selectedUF && selectedUF !== "all" ? selectedUF : undefined,
    tecnologia: selectedTecnologia && selectedTecnologia !== "all" ? selectedTecnologia : undefined,
    subcategoria: selectedSubcategoria && selectedSubcategoria !== "all" ? selectedSubcategoria : undefined,
    tipoAcesso: selectedTipoAcesso && selectedTipoAcesso !== "all" ? selectedTipoAcesso : undefined,
    tipoReclamacao: selectedTipoReclamacao && selectedTipoReclamacao !== "all" ? selectedTipoReclamacao : undefined,
    startDate: dateFrom,
    endDate: dateTo,
  });

  // Aplicar filtros de drill-down no lado do cliente
  const filteredData = useMemo(() => {
    return backendData;
  }, [backendData]);

  const drillDownData = useMemo(() => {
    if (!drillPath.descDetalhada) return filteredData;
    return getDrillDownData(
      filteredData,
      drillPath.descDetalhada,
      drillPath.causa,
      drillPath.nivel1,
      drillPath.nivel2
    );
  }, [filteredData, drillPath]);

  const descDetalhadaData = useMemo(
    () => aggregateByField(filteredData, "DESC_DETALHADA"),
    [filteredData]
  );

  // Drill-down independente para Causa
  const causaDrillDownData = useMemo(() => {
    if (!causaDrillPath.causa) return filteredData;
    
    let filtered = filteredData.filter((record) => record.CAUSA === causaDrillPath.causa);
    
    if (causaDrillPath.nivel1) {
      filtered = filtered.filter((record) => record.NIVEL1 === causaDrillPath.nivel1);
    }
    
    if (causaDrillPath.nivel2) {
      filtered = filtered.filter((record) => record.NIVEL2 === causaDrillPath.nivel2);
    }
    
    if (causaDrillPath.nivel3) {
      filtered = filtered.filter((record) => record.NIVEL3 === causaDrillPath.nivel3);
    }
    
    return filtered;
  }, [filteredData, causaDrillPath]);

  const causaDataMain = useMemo(
    () => aggregateByField(filteredData, "CAUSA"),
    [filteredData]
  );

  const causaNivel1Data = useMemo(() => {
    if (!causaDrillPath.causa) return [];
    const data = filteredData.filter((record) => record.CAUSA === causaDrillPath.causa);
    return aggregateByField(data, "NIVEL1");
  }, [filteredData, causaDrillPath.causa]);

  const causaNivel2Data = useMemo(() => {
    if (!causaDrillPath.nivel1) return [];
    const data = filteredData.filter(
      (record) =>
        record.CAUSA === causaDrillPath.causa && record.NIVEL1 === causaDrillPath.nivel1
    );
    return aggregateByField(data, "NIVEL2");
  }, [filteredData, causaDrillPath]);

  const causaNivel3Data = useMemo(() => {
    if (!causaDrillPath.nivel2) return [];
    const data = filteredData.filter(
      (record) =>
        record.CAUSA === causaDrillPath.causa &&
        record.NIVEL1 === causaDrillPath.nivel1 &&
        record.NIVEL2 === causaDrillPath.nivel2
    );
    return aggregateByField(data, "NIVEL3");
  }, [filteredData, causaDrillPath]);

  const causaCamadaData = useMemo(() => {
    if (!causaDrillPath.nivel3) return [];
    const data = filteredData.filter(
      (record) =>
        record.CAUSA === causaDrillPath.causa &&
        record.NIVEL1 === causaDrillPath.nivel1 &&
        record.NIVEL2 === causaDrillPath.nivel2 &&
        record.NIVEL3 === causaDrillPath.nivel3
    );
    return aggregateByField(data, "CAMADA");
  }, [filteredData, causaDrillPath]);

  // Drill-down independente para Nivel1
  const nivel1MainData = useMemo(
    () => aggregateByField(filteredData, "NIVEL1"),
    [filteredData]
  );

  const nivel1Nivel2Data = useMemo(() => {
    if (!nivel1DrillPath.nivel1) return [];
    const data = filteredData.filter((record) => record.NIVEL1 === nivel1DrillPath.nivel1);
    return aggregateByField(data, "NIVEL2");
  }, [filteredData, nivel1DrillPath.nivel1]);

  const nivel1Nivel3Data = useMemo(() => {
    if (!nivel1DrillPath.nivel2) return [];
    const data = filteredData.filter(
      (record) =>
        record.NIVEL1 === nivel1DrillPath.nivel1 && record.NIVEL2 === nivel1DrillPath.nivel2
    );
    return aggregateByField(data, "NIVEL3");
  }, [filteredData, nivel1DrillPath]);

  // Drill-down independente para Nivel2
  const nivel2MainData = useMemo(
    () => aggregateByField(filteredData, "NIVEL2"),
    [filteredData]
  );

  const nivel2Nivel3Data = useMemo(() => {
    if (!nivel2DrillPath.nivel2) return [];
    const data = filteredData.filter((record) => record.NIVEL2 === nivel2DrillPath.nivel2);
    return aggregateByField(data, "NIVEL3");
  }, [filteredData, nivel2DrillPath.nivel2]);

  // Drill-down independente para Nivel3
  const nivel3MainData = useMemo(
    () => aggregateByField(filteredData, "NIVEL3"),
    [filteredData]
  );

  const causaData = useMemo(() => {
    if (!drillPath.descDetalhada) return [];
    const data = getDrillDownData(filteredData, drillPath.descDetalhada);
    return aggregateByField(data, "CAUSA");
  }, [filteredData, drillPath.descDetalhada]);

  const nivel1Data = useMemo(() => {
    if (!drillPath.causa) return [];
    const data = getDrillDownData(filteredData, drillPath.descDetalhada!, drillPath.causa);
    return aggregateByField(data, "NIVEL1");
  }, [filteredData, drillPath]);

  const nivel2Data = useMemo(() => {
    if (!drillPath.nivel1) return [];
    const data = getDrillDownData(
      filteredData,
      drillPath.descDetalhada!,
      drillPath.causa,
      drillPath.nivel1
    );
    return aggregateByField(data, "NIVEL2");
  }, [filteredData, drillPath]);

  const nivel3Data = useMemo(() => {
    if (!drillPath.nivel2) return [];
    const data = getDrillDownData(
      filteredData,
      drillPath.descDetalhada!,
      drillPath.causa,
      drillPath.nivel1,
      drillPath.nivel2
    );
    return aggregateByField(data, "NIVEL3");
  }, [filteredData, drillPath]);

  const regionals = useMemo(() => getUniqueValues(filteredData, "REGIONAL"), [filteredData]);
  const ufs = useMemo(() => getUniqueValues(filteredData, "UF"), [filteredData]);
  const tecnologias = useMemo(() => getUniqueValues(filteredData, "TECNOLOGIA"), [filteredData]);
  const subcategorias = useMemo(() => getUniqueValues(filteredData, "DESC_SUBCATEGORIA"), [filteredData]);
  const tiposAcesso = useMemo(() => getUniqueValues(filteredData, "TIPO_ACESSO"), [filteredData]);
  const tiposReclamacao = useMemo(() => getUniqueValues(filteredData, "TIPO_RECLAMACAO"), [filteredData]);

  const topRegionals = useMemo(() => getTopRegionals(filteredData), [filteredData]);
  const topArmarios = useMemo(() => getTopArmarios(filteredData), [filteredData]);
  const topUFs = useMemo(() => getTopUFs(filteredData), [filteredData]);
  const topTecnologias = useMemo(() => getTopTecnologias(filteredData), [filteredData]);
  const topSubcategorias = useMemo(() => getTopSubcategorias(filteredData), [filteredData]);
  const topTiposAcesso = useMemo(() => getTopTiposAcesso(filteredData), [filteredData]);

  const resetFilters = () => {
    setSelectedRegional(undefined);
    setSelectedUF(undefined);
    setSelectedTecnologia(undefined);
    setSelectedSubcategoria(undefined);
    setSelectedTipoAcesso(undefined);
    setSelectedTipoReclamacao(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const handleDateChange = (from: Date | undefined, to: Date | undefined) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const resetDrill = () => {
    setDrillPath({});
  };

  const resetCausaDrill = () => {
    setCausaDrillPath({});
  };

  const resetNivel1Drill = () => {
    setNivel1DrillPath({});
  };

  const resetNivel2Drill = () => {
    setNivel2DrillPath({});
  };

  const resetNivel3Drill = () => {
    setNivel3DrillPath({});
  };

  const resetAllDrills = () => {
    resetDrill();
    resetCausaDrill();
    resetNivel1Drill();
    resetNivel2Drill();
    resetNivel3Drill();
  };

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Dashboard", onClick: resetAllDrills }];
    if (drillPath.descDetalhada) {
      items.push({
        label: drillPath.descDetalhada,
        onClick: () => setDrillPath({ descDetalhada: drillPath.descDetalhada }),
      });
    }
    if (drillPath.causa) {
      items.push({
        label: drillPath.causa,
        onClick: () =>
          setDrillPath({ descDetalhada: drillPath.descDetalhada, causa: drillPath.causa }),
      });
    }
    if (drillPath.nivel1) {
      items.push({
        label: drillPath.nivel1,
        onClick: () =>
          setDrillPath({
            descDetalhada: drillPath.descDetalhada,
            causa: drillPath.causa,
            nivel1: drillPath.nivel1,
          }),
      });
    }
    if (drillPath.nivel2) {
      items.push({ label: drillPath.nivel2, onClick: undefined });
    }
    return items;
  }, [drillPath]);

  const causaBreadcrumbItems = useMemo(() => {
    const items = [{ label: "Dashboard", onClick: resetAllDrills }];
    if (causaDrillPath.causa) {
      items.push({
        label: causaDrillPath.causa,
        onClick: () => setCausaDrillPath({ causa: causaDrillPath.causa }),
      });
    }
    if (causaDrillPath.nivel1) {
      items.push({
        label: causaDrillPath.nivel1,
        onClick: () =>
          setCausaDrillPath({ causa: causaDrillPath.causa, nivel1: causaDrillPath.nivel1 }),
      });
    }
    if (causaDrillPath.nivel2) {
      items.push({
        label: causaDrillPath.nivel2,
        onClick: () =>
          setCausaDrillPath({
            causa: causaDrillPath.causa,
            nivel1: causaDrillPath.nivel1,
            nivel2: causaDrillPath.nivel2,
          }),
      });
    }
    if (causaDrillPath.nivel3) {
      items.push({ label: causaDrillPath.nivel3, onClick: undefined });
    }
    return items;
  }, [causaDrillPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-destructive">Erro ao carregar dados</h2>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os dados. Verifique se você já importou dados usando o botão "Importar Dados".
          </p>
          <Link to="/import">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Importar Dados
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Dashboard Multi-Tecnologia
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Análise dinâmica de defeitos e incidentes
              </p>
            </div>
            <Link to="/import">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Importar Dados
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <BreadcrumbNav items={
              drillPath.descDetalhada ? breadcrumbItems : 
              causaDrillPath.causa ? causaBreadcrumbItems : 
              breadcrumbItems
            } />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filtros no topo */}
        <div className="mb-6">
          <FilterPanel
            regionals={regionals}
            ufs={ufs}
            tecnologias={tecnologias}
            subcategorias={subcategorias}
            tiposAcesso={tiposAcesso}
            tiposReclamacao={tiposReclamacao}
            selectedRegional={selectedRegional}
            selectedUF={selectedUF}
            selectedTecnologia={selectedTecnologia}
            selectedSubcategoria={selectedSubcategoria}
            selectedTipoAcesso={selectedTipoAcesso}
            selectedTipoReclamacao={selectedTipoReclamacao}
            onRegionalChange={setSelectedRegional}
            onUFChange={setSelectedUF}
            onTecnologiaChange={setSelectedTecnologia}
            onSubcategoriaChange={setSelectedSubcategoria}
            onTipoAcessoChange={setSelectedTipoAcesso}
            onTipoReclamacaoChange={setSelectedTipoReclamacao}
            onDateChange={handleDateChange}
            onReset={resetFilters}
          />
        </div>

        {/* Métricas Gerais */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Métricas Gerais
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total de Defeitos"
              value={drillDownData.length.toLocaleString()}
              icon={Database}
            />
            <MetricCard
              title="Motivos Únicos"
              value={descDetalhadaData.length}
              icon={Activity}
            />
            <MetricCard
              title="Principal Motivo"
              value={descDetalhadaData[0]?.name || "N/A"}
              icon={AlertCircle}
            />
            <MetricCard
              title="Taxa do Principal"
              value={`${descDetalhadaData[0]?.percentage.toFixed(1) || 0}%`}
              icon={TrendingUp}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
            <MetricCard
              title="Tecnologias Ativas"
              value={tecnologias.length}
              icon={Network}
            />
            <MetricCard
              title="Subcategorias"
              value={subcategorias.length}
              icon={Wifi}
            />
            <MetricCard
              title="Tipos de Acesso"
              value={tiposAcesso.length}
              icon={Phone}
            />
            <MetricCard
              title="Regionais"
              value={regionals.length}
              icon={Activity}
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Rankings */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-primary" />
            Rankings
            {(selectedRegional || selectedUF || selectedTecnologia || selectedSubcategoria || selectedTipoAcesso || selectedTipoReclamacao || dateFrom || dateTo) && (
              <Badge variant="secondary" className="ml-2">
                Filtrado
              </Badge>
            )}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RankingCard
              title="Top 8 Regionais"
              description="Regionais com mais incidentes"
              data={topRegionals}
              color="hsl(220, 90%, 56%)"
              topN={8}
            />
            <RankingCard
              title="Top 8 Armários"
              description="Armários com mais defeitos"
              data={topArmarios}
              color="hsl(280, 80%, 56%)"
              topN={8}
            />
            <RankingCard
              title="Top 8 Estados (UF)"
              description="Estados com mais registros"
              data={topUFs}
              color="hsl(340, 82%, 52%)"
              topN={8}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <RankingCard
              title="Top Tecnologias"
              description="Tecnologias com mais defeitos"
              data={topTecnologias}
              color="hsl(160, 70%, 50%)"
              topN={8}
            />
            <RankingCard
              title="Top Subcategorias"
              description="Subcategorias com mais incidentes"
              data={topSubcategorias}
              color="hsl(30, 90%, 55%)"
              topN={8}
            />
            <RankingCard
              title="Top Tipos de Acesso"
              description="Tipos de acesso mais afetados"
              data={topTiposAcesso}
              color="hsl(200, 85%, 55%)"
              topN={8}
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Análise Drill-Down */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Análise de Motivos
          </h2>
        </div>

        <div className="space-y-6">
          {!drillPath.descDetalhada && !causaDrillPath.causa && !nivel1DrillPath.nivel1 && !nivel2DrillPath.nivel2 && !nivel3DrillPath.nivel3 && (
            <>
              <DrillDownView
                title="Motivos de Abertura (DESC_DETALHADA)"
                description="Clique em um item para ver mais detalhes"
                data={descDetalhadaData}
                onItemClick={(item) => { resetCausaDrill(); resetNivel1Drill(); resetNivel2Drill(); resetNivel3Drill(); setDrillPath({ descDetalhada: item }); }}
                colorIndex={0}
                showLabels={true}
                showPercentage={false}
              />
              
              <DrillDownView
                title="Motivos Causa"
                description="Clique em um item para ver mais detalhes"
                data={causaDataMain}
                onItemClick={(item) => { resetDrill(); resetNivel1Drill(); resetNivel2Drill(); resetNivel3Drill(); setCausaDrillPath({ causa: item }); }}
                colorIndex={1}
                showLabels={true}
                showPercentage={false}
              />

              <DrillDownView
                title="Nível 1"
                description="Clique em um item para ver mais detalhes"
                data={nivel1MainData}
                onItemClick={(item) => { resetDrill(); resetCausaDrill(); resetNivel2Drill(); resetNivel3Drill(); setNivel1DrillPath({ nivel1: item }); }}
                colorIndex={2}
                showLabels={true}
                showPercentage={false}
              />

              <DrillDownView
                title="Nível 2"
                description="Clique em um item para ver mais detalhes"
                data={nivel2MainData}
                onItemClick={(item) => { resetDrill(); resetCausaDrill(); resetNivel1Drill(); resetNivel3Drill(); setNivel2DrillPath({ nivel2: item }); }}
                colorIndex={3}
                showLabels={true}
                showPercentage={false}
              />

              <DrillDownView
                title="Nível 3"
                description="Clique em um item para ver mais detalhes"
                data={nivel3MainData}
                onItemClick={(item) => { resetDrill(); resetCausaDrill(); resetNivel1Drill(); resetNivel2Drill(); setNivel3DrillPath({ nivel3: item }); }}
                colorIndex={4}
                showLabels={true}
                showPercentage={false}
              />
            </>
          )}

          {/* Drill-down DESC_DETALHADA */}
          {drillPath.descDetalhada && !drillPath.causa && (
            <DrillDownView
              title={`Causas para: ${drillPath.descDetalhada}`}
              description="Clique para explorar os níveis de detalhamento"
              data={causaData}
              onItemClick={(item) => setDrillPath({ ...drillPath, causa: item })}
              colorIndex={1}
            />
          )}

          {drillPath.causa && !drillPath.nivel1 && (
            <DrillDownView
              title={`Nível 1 - ${drillPath.causa}`}
              description="Primeiro nível de detalhamento"
              data={nivel1Data}
              onItemClick={(item) => setDrillPath({ ...drillPath, nivel1: item })}
              colorIndex={2}
            />
          )}

          {drillPath.nivel1 && !drillPath.nivel2 && (
            <DrillDownView
              title={`Nível 2 - ${drillPath.nivel1}`}
              description="Segundo nível de detalhamento"
              data={nivel2Data}
              onItemClick={(item) => setDrillPath({ ...drillPath, nivel2: item })}
              colorIndex={3}
            />
          )}

          {drillPath.nivel2 && (
            <DrillDownView
              title={`Nível 3 - ${drillPath.nivel2}`}
              description="Nível mais detalhado de análise"
              data={nivel3Data}
              colorIndex={4}
            />
          )}

          {/* Drill-down CAUSA independente */}
          {causaDrillPath.causa && !causaDrillPath.nivel1 && (
            <DrillDownView
              title={`Nível 1 para: ${causaDrillPath.causa}`}
              description="Clique para ver mais detalhes"
              data={causaNivel1Data}
              onItemClick={(item) => setCausaDrillPath({ ...causaDrillPath, nivel1: item })}
              colorIndex={2}
            />
          )}

          {causaDrillPath.nivel1 && !causaDrillPath.nivel2 && (
            <DrillDownView
              title={`Nível 2 - ${causaDrillPath.nivel1}`}
              description="Clique para ver mais detalhes"
              data={causaNivel2Data}
              onItemClick={(item) => setCausaDrillPath({ ...causaDrillPath, nivel2: item })}
              colorIndex={3}
            />
          )}

          {causaDrillPath.nivel2 && !causaDrillPath.nivel3 && (
            <DrillDownView
              title={`Nível 3 - ${causaDrillPath.nivel2}`}
              description="Clique para ver mais detalhes"
              data={causaNivel3Data}
              onItemClick={(item) => setCausaDrillPath({ ...causaDrillPath, nivel3: item })}
              colorIndex={4}
            />
          )}

          {causaDrillPath.nivel3 && (
            <DrillDownView
              title={`Camada - ${causaDrillPath.nivel3}`}
              description="Nível mais detalhado de análise"
              data={causaCamadaData}
              colorIndex={5}
            />
          )}

          {/* Drill-down Nivel1 independente */}
          {nivel1DrillPath.nivel1 && !nivel1DrillPath.nivel2 && (
            <DrillDownView
              title={`Nível 2 para: ${nivel1DrillPath.nivel1}`}
              description="Clique para ver mais detalhes"
              data={nivel1Nivel2Data}
              onItemClick={(item) => setNivel1DrillPath({ ...nivel1DrillPath, nivel2: item })}
              colorIndex={3}
            />
          )}

          {nivel1DrillPath.nivel2 && !nivel1DrillPath.nivel3 && (
            <DrillDownView
              title={`Nível 3 - ${nivel1DrillPath.nivel2}`}
              description="Clique para ver mais detalhes"
              data={nivel1Nivel3Data}
              onItemClick={(item) => setNivel1DrillPath({ ...nivel1DrillPath, nivel3: item })}
              colorIndex={4}
            />
          )}

          {nivel1DrillPath.nivel3 && (
            <DrillDownView
              title={`Detalhamento - ${nivel1DrillPath.nivel3}`}
              description="Nível mais detalhado de análise"
              data={[]}
              colorIndex={5}
            />
          )}

          {/* Drill-down Nivel2 independente */}
          {nivel2DrillPath.nivel2 && !nivel2DrillPath.nivel3 && (
            <DrillDownView
              title={`Nível 3 para: ${nivel2DrillPath.nivel2}`}
              description="Clique para ver mais detalhes"
              data={nivel2Nivel3Data}
              onItemClick={(item) => setNivel2DrillPath({ ...nivel2DrillPath, nivel3: item })}
              colorIndex={4}
            />
          )}

          {nivel2DrillPath.nivel3 && (
            <DrillDownView
              title={`Detalhamento - ${nivel2DrillPath.nivel3}`}
              description="Nível mais detalhado de análise"
              data={[]}
              colorIndex={5}
            />
          )}

          {/* Drill-down Nivel3 independente */}
          {nivel3DrillPath.nivel3 && (
            <DrillDownView
              title={`Detalhamento - ${nivel3DrillPath.nivel3}`}
              description="Nível mais detalhado de análise"
              data={[]}
              colorIndex={5}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
