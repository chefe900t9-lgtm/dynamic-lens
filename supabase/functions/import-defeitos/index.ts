import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DefeitoInput {
  DT_CRIACAO: number | string;
  DESC_CATEGORIA: string;
  DESC_SUBCATEGORIA: string;
  DESC_DETALHADA: string;
  TECNOLOGIA: string;
  ARMARIO: string;
  TIPO_ACESSO: string;
  SUBTECNOLOGIA?: string;
  STRG_REDE?: string;
  TIPO_RECLAMACAO: string;
  REGIONAL: string;
  UF: string;
  EVENTO_SAS?: string;
  CAUSA?: string;
  NIVEL1?: string;
  NIVEL2?: string;
  NIVEL3?: string;
  CAMADA?: string;
}

// Converter data Excel para timestamp
function excelDateToTimestamp(excelDate: number | string): string {
  if (typeof excelDate === 'string') {
    // Se já é uma string de data, tentar parsear
    const parsed = new Date(excelDate);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
    // Se formato DD/MM/YYYY
    const parts = excelDate.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    }
    return new Date().toISOString();
  }
  
  // Converter número Excel para data
  const epoch = new Date(1899, 11, 30);
  const excelEpoch = epoch.getTime();
  const msPerDay = 86400000;
  const date = new Date(excelEpoch + excelDate * msPerDay);
  return date.toISOString();
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: requestData, batch_size = 1000, clear_existing = false } = await req.json();

    console.log(`Recebido lote com ${requestData?.length || 0} registros`);

    // Limpar dados existentes se solicitado
    if (clear_existing) {
      console.log('Limpando dados existentes...');
      const { error: deleteError } = await supabase
        .from('defeitos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        throw new Error(`Erro ao limpar dados: ${deleteError.message}`);
      }
      console.log('Dados limpos com sucesso');
    }

    if (!requestData || !Array.isArray(requestData) || requestData.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Nenhum dado fornecido',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Processar e transformar dados
    const transformedData = requestData.map((item: DefeitoInput) => ({
      dt_criacao: excelDateToTimestamp(item.DT_CRIACAO),
      desc_categoria: item.DESC_CATEGORIA || '',
      desc_subcategoria: item.DESC_SUBCATEGORIA || '',
      desc_detalhada: item.DESC_DETALHADA || '',
      tecnologia: item.TECNOLOGIA || '',
      armario: item.ARMARIO || '',
      tipo_acesso: item.TIPO_ACESSO || '',
      subtecnologia: item.SUBTECNOLOGIA || null,
      strg_rede: item.STRG_REDE || null,
      tipo_reclamacao: item.TIPO_RECLAMACAO || '',
      regional: item.REGIONAL || '',
      uf: item.UF || '',
      evento_sas: item.EVENTO_SAS || null,
      causa: item.CAUSA || null,
      nivel1: item.NIVEL1 || null,
      nivel2: item.NIVEL2 || null,
      nivel3: item.NIVEL3 || null,
      camada: item.CAMADA || null,
    }));

    // Inserir em lotes
    const batchSize = batch_size;
    let totalInserted = 0;
    const errors = [];

    for (let i = 0; i < transformedData.length; i += batchSize) {
      const batch = transformedData.slice(i, i + batchSize);
      
      console.log(`Inserindo lote ${Math.floor(i / batchSize) + 1}: ${batch.length} registros`);
      
      const { data, error } = await supabase
        .from('defeitos')
        .insert(batch)
        .select('id');

      if (error) {
        console.error(`Erro no lote ${Math.floor(i / batchSize) + 1}:`, error);
        errors.push({
          batch: Math.floor(i / batchSize) + 1,
          error: error.message
        });
      } else {
        totalInserted += data?.length || 0;
        console.log(`Lote inserido: ${data?.length || 0} registros`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_received: requestData.length,
        total_inserted: totalInserted,
        errors: errors.length > 0 ? errors : null,
        message: `${totalInserted} registros importados com sucesso`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Erro na importação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({
        error: errorMessage,
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});