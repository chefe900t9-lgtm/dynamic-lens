import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Database } from "lucide-react";
import multiTechData from "@/data/multi_tech_data.json";
import { excelDateToDate, parseDateString } from "@/utils/dataProcessor";
import type { DataRecord } from "@/utils/dataProcessor";

const DataInfo = () => {
  const data = multiTechData as DataRecord[];

  const analysis = useMemo(() => {
    // Extrair regionais únicas
    const regionaisSet = new Set<string>();
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    data.forEach((record) => {
      // Regional
      if (record.REGIONAL) {
        regionaisSet.add(record.REGIONAL);
      }

      // Datas
      if (record.DT_CRIACAO) {
        const dateStr = parseDateString(record.DT_CRIACAO);
        if (dateStr) {
          const date = typeof record.DT_CRIACAO === 'number' 
            ? excelDateToDate(record.DT_CRIACAO)
            : new Date(dateStr.split('/').reverse().join('-'));
          
          if (!minDate || date < minDate) {
            minDate = date;
          }
          if (!maxDate || date > maxDate) {
            maxDate = date;
          }
        }
      }
    });

    const regionais = Array.from(regionaisSet).sort();
    
    // Contar registros por regional
    const regionalCounts = regionais.map(regional => ({
      name: regional,
      count: data.filter(r => r.REGIONAL === regional).length
    })).sort((a, b) => b.count - a.count);

    return {
      regionais,
      regionalCounts,
      minDate,
      maxDate,
      totalRecords: data.length
    };
  }, [data]);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Informações dos Dados
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Análise do arquivo de dados carregado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Resumo Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Resumo Geral
            </CardTitle>
            <CardDescription>Informações gerais sobre os dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Total de Registros</div>
                <div className="text-2xl font-bold">{analysis.totalRecords.toLocaleString("pt-BR")}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Regionais Únicas</div>
                <div className="text-2xl font-bold">{analysis.regionais.length}</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">Período</div>
                <div className="text-sm font-semibold">
                  {formatDate(analysis.minDate)} até {formatDate(analysis.maxDate)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Período de Datas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período dos Dados
            </CardTitle>
            <CardDescription>Intervalo de datas disponíveis no arquivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-2">Data Mais Antiga</div>
                <div className="text-xl font-semibold text-primary">
                  {formatDate(analysis.minDate)}
                </div>
              </div>
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground mb-2">Data Mais Recente</div>
                <div className="text-xl font-semibold text-primary">
                  {formatDate(analysis.maxDate)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regionais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Regionais Disponíveis
            </CardTitle>
            <CardDescription>
              {analysis.regionais.length} regionais encontradas no arquivo, ordenadas por volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.regionalCounts.map(({ name, count }, index) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-sm text-muted-foreground">
                        {count.toLocaleString("pt-BR")} registros ({((count / analysis.totalRecords) * 100).toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {count.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataInfo;
