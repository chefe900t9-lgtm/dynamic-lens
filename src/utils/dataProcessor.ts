export interface DataRecord {
  DT_CRIACAO: number | string;
  DESC_CATEGORIA?: string;
  DESC_SUBCATEGORIA?: string;
  DESC_DETALHADA: string;
  TECNOLOGIA?: string;
  ARMARIO: string;
  TIPO_ACESSO?: string;
  SUBTECNOLOGIA?: string;
  STRG_REDE?: string;
  TIPO_RECLAMACAO?: string;
  CIDADE?: string;
  REGIONAL: string;
  UF: string;
  EVENTO_SAS?: string;
  CAUSA?: string;
  NIVEL1?: string;
  NIVEL2?: string;
  NIVEL3?: string;
  CAMADA?: string;
}

// Converte data Excel (número) para Date
export const excelDateToDate = (excelDate: number): Date => {
  const excelEpoch = new Date(1899, 11, 30);
  return new Date(excelEpoch.getTime() + excelDate * 86400000);
};

// Converte data Excel ou string para string formatada
export const parseDateString = (dateValue: number | string): string => {
  if (!dateValue) return "";
  
  // Se for número (formato Excel), converte
  if (typeof dateValue === 'number') {
    const date = excelDateToDate(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Se for string com horário "DD/MM/YYYY HH:MM", remove horário
  if (typeof dateValue === 'string' && dateValue.includes(' ')) {
    return dateValue.split(' ')[0];
  }
  
  return dateValue.toString();
};

export const dateStringToDate = (dateStr: string): Date => {
  // Converte "DD/MM/YYYY" para objeto Date
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export interface AggregatedData {
  name: string;
  value: number;
  percentage: number;
}

export const aggregateByField = (
  data: DataRecord[],
  field: keyof DataRecord
): AggregatedData[] => {
  const counts: Record<string, number> = {};
  
  data.forEach((record) => {
    const value = record[field] || "Não informado";
    counts[value] = (counts[value] || 0) + 1;
  });

  const total = data.length;
  
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: (value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);
};

export const filterByPeriod = (
  data: DataRecord[],
  startDate?: Date,
  endDate?: Date
): DataRecord[] => {
  if (!startDate && !endDate) return data;
  
  return data.filter((record) => {
    if (!record.DT_CRIACAO) return false;
    const dateOnly = parseDateString(record.DT_CRIACAO);
    if (!dateOnly) return false;
    const recordDate = dateStringToDate(dateOnly);
    
    if (startDate) {
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      if (recordDate < startDateOnly) return false;
    }
    if (endDate) {
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      if (recordDate > endDateOnly) return false;
    }
    return true;
  });
};

export const filterByRegional = (
  data: DataRecord[],
  regional?: string
): DataRecord[] => {
  if (!regional) return data;
  return data.filter((record) => record.REGIONAL === regional);
};

export const filterByUF = (
  data: DataRecord[],
  uf?: string
): DataRecord[] => {
  if (!uf) return data;
  return data.filter((record) => record.UF === uf);
};

export const filterByTecnologia = (
  data: DataRecord[],
  tecnologia?: string
): DataRecord[] => {
  if (!tecnologia) return data;
  return data.filter((record) => record.TECNOLOGIA === tecnologia);
};

export const filterBySubcategoria = (
  data: DataRecord[],
  subcategoria?: string
): DataRecord[] => {
  if (!subcategoria) return data;
  return data.filter((record) => record.DESC_SUBCATEGORIA === subcategoria);
};

export const filterByTipoAcesso = (
  data: DataRecord[],
  tipoAcesso?: string
): DataRecord[] => {
  if (!tipoAcesso) return data;
  return data.filter((record) => record.TIPO_ACESSO === tipoAcesso);
};

export const filterByTipoReclamacao = (
  data: DataRecord[],
  tipoReclamacao?: string
): DataRecord[] => {
  if (!tipoReclamacao) return data;
  return data.filter((record) => record.TIPO_RECLAMACAO === tipoReclamacao);
};

export const getDrillDownData = (
  data: DataRecord[],
  descDetalhada: string,
  causa?: string,
  nivel1?: string,
  nivel2?: string
): DataRecord[] => {
  let filtered = data.filter((record) => record.DESC_DETALHADA === descDetalhada);
  
  if (causa) {
    filtered = filtered.filter((record) => record.CAUSA === causa);
  }
  
  if (nivel1) {
    filtered = filtered.filter((record) => record.NIVEL1 === nivel1);
  }
  
  if (nivel2) {
    filtered = filtered.filter((record) => record.NIVEL2 === nivel2);
  }
  
  return filtered;
};

export const getTopN = (data: AggregatedData[], n: number): AggregatedData[] => {
  return data.slice(0, n);
};

export const getUniqueValues = (
  data: DataRecord[],
  field: keyof DataRecord
): string[] => {
  const values = new Set(
    data
      .map((record) => record[field])
      .filter(Boolean)
      .map((val) => String(val))
  );
  return Array.from(values).sort();
};

export interface RankingItem {
  rank: number;
  name: string;
  value: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  count: number;
  percentage: number;
}

export interface Insight {
  title: string;
  description: string;
  value: string;
  type: "monthly" | "regional" | "cause" | "trend" | "armario";
  trend?: "up" | "down" | "stable";
}

export const getTopRegionals = (data: DataRecord[]): RankingItem[] => {
  const aggregated = aggregateByField(data, "REGIONAL");
  const total = data.length;
  
  return aggregated.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
  }));
};

export const getTopArmarios = (data: DataRecord[]): RankingItem[] => {
  const aggregated = aggregateByField(data, "ARMARIO");
  const total = data.length;
  
  return aggregated.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
  }));
};

export const getTopUFs = (data: DataRecord[]): RankingItem[] => {
  const aggregated = aggregateByField(data, "UF");
  const total = data.length;
  
  return aggregated.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
  }));
};

export const getTopTecnologias = (data: DataRecord[]): RankingItem[] => {
  const aggregated = aggregateByField(data, "TECNOLOGIA");
  const total = data.length;
  
  return aggregated.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
  }));
};

export const getTopSubcategorias = (data: DataRecord[]): RankingItem[] => {
  const aggregated = aggregateByField(data, "DESC_SUBCATEGORIA");
  const total = data.length;
  
  return aggregated.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
  }));
};

export const getTopTiposAcesso = (data: DataRecord[]): RankingItem[] => {
  const aggregated = aggregateByField(data, "TIPO_ACESSO");
  const total = data.length;
  
  return aggregated.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    value: item.value,
    percentage: (item.value / total) * 100,
  }));
};

export const getMonthlyBreakdown = (data: DataRecord[]): MonthlyData[] => {
  const monthCounts: Record<string, number> = {};
  
  data.forEach((record) => {
    if (!record.DT_CRIACAO) return;
    const dateOnly = parseDateString(record.DT_CRIACAO);
    if (!dateOnly) return;
    const date = dateStringToDate(dateOnly);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });
  
  const total = data.length;
  
  return Object.entries(monthCounts)
    .map(([month, count]) => ({
      month,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const generateInsights = (data: DataRecord[]): Insight[] => {
  const insights: Insight[] = [];
  
  // Comparação mensal
  const monthlyData = getMonthlyBreakdown(data);
  if (monthlyData.length >= 2) {
    const latest = monthlyData[monthlyData.length - 1];
    const previous = monthlyData[monthlyData.length - 2];
    const percentChange = ((latest.count - previous.count) / previous.count) * 100;
    
    if (Math.abs(percentChange) > 5) {
      const latestMonth = new Date(latest.month + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const previousMonth = new Date(previous.month + "-01").toLocaleDateString("pt-BR", { month: "long" });
      
      insights.push({
        title: "Comparação Mensal",
        description: `${latestMonth} teve ${Math.abs(percentChange).toFixed(0)}% ${percentChange > 0 ? "mais" : "menos"} ocorrências que ${previousMonth}`,
        value: `${latest.count.toLocaleString("pt-BR")} ocorrências`,
        type: "monthly",
        trend: percentChange > 0 ? "up" : "down",
      });
    }
  }
  
  // Concentração regional
  const topRegional = getTopRegionals(data)[0];
  if (topRegional && topRegional.percentage > 20) {
    insights.push({
      title: "Concentração Regional",
      description: `${topRegional.name} concentra a maior parte dos incidentes`,
      value: `${topRegional.percentage.toFixed(1)}% do total`,
      type: "regional",
    });
  }
  
  // Top causas
  const topCausas = aggregateByField(data, "CAUSA").slice(0, 3);
  const topCausasPercentage = topCausas.reduce((acc, causa) => acc + causa.percentage, 0);
  
  insights.push({
    title: "Principais Causas",
    description: `As 3 principais causas representam a maioria dos problemas`,
    value: `${topCausasPercentage.toFixed(1)}% do total`,
    type: "cause",
  });
  
  // Armário crítico
  const topArmario = getTopArmarios(data)[0];
  if (topArmario && topArmario.percentage > 5) {
    insights.push({
      title: "Armário Crítico",
      description: `${topArmario.name} apresenta volume elevado de incidentes`,
      value: `${topArmario.value} ocorrências`,
      type: "armario",
    });
  }
  
  // Principal motivo
  const topMotivo = aggregateByField(data, "DESC_DETALHADA")[0];
  if (topMotivo) {
    insights.push({
      title: "Motivo Principal",
      description: `${topMotivo.name} é o motivo #1 de abertura`,
      value: `${topMotivo.value} ocorrências`,
      type: "trend",
    });
  }
  
  return insights;
};
