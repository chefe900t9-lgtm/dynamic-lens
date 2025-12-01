import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function ImportData() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clearExisting, setClearExisting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo JSON válido",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      if (!Array.isArray(jsonData)) {
        throw new Error("O arquivo JSON deve conter um array de objetos");
      }

      // Dividir em lotes de 1000 registros
      const batchSize = 1000;
      const totalBatches = Math.ceil(jsonData.length / batchSize);
      let processedBatches = 0;

      toast({
        title: "Iniciando importação",
        description: `Processando ${jsonData.length} registros em ${totalBatches} lotes...`,
      });

      for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);

        const { data, error } = await supabase.functions.invoke('import-defeitos', {
          body: {
            data: batch,
            batch_size: batchSize,
            clear_existing: clearExisting && i === 0, // Limpar apenas no primeiro lote
          },
        });

        if (error) {
          throw error;
        }

        processedBatches++;
        setProgress((processedBatches / totalBatches) * 100);

        console.log(`Lote ${processedBatches}/${totalBatches} importado:`, data);
      }

      toast({
        title: "Importação concluída!",
        description: `${jsonData.length} registros foram importados com sucesso`,
      });

      setFile(null);
      setClearExisting(false);
      setProgress(0);

    } catch (error: any) {
      console.error("Erro na importação:", error);
      toast({
        title: "Erro na importação",
        description: error.message || "Ocorreu um erro ao importar os dados",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!")) {
      return;
    }

    setImporting(true);

    try {
      const { data, error } = await supabase.functions.invoke('import-defeitos', {
        body: {
          data: [],
          clear_existing: true,
        },
      });

      if (error) throw error;

      toast({
        title: "Dados limpos",
        description: "Todos os dados foram removidos com sucesso",
      });

    } catch (error: any) {
      console.error("Erro ao limpar dados:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao limpar os dados",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Importação de Dados</h1>
          <p className="text-muted-foreground mt-2">
            Importe seus arquivos JSON com dados de defeitos
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Formato esperado:</strong> Array JSON com campos DT_CRIACAO, DESC_CATEGORIA, DESC_SUBCATEGORIA, 
            DESC_DETALHADA, TECNOLOGIA, ARMARIO, TIPO_ACESSO, TIPO_RECLAMACAO, REGIONAL, UF e campos opcionais.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo JSON</CardTitle>
            <CardDescription>
              Selecione um arquivo JSON para importar. Arquivos grandes serão processados em lotes automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={importing}
                className="flex-1"
              />
            </div>

            {file && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Arquivo selecionado:</strong> {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="clearExisting"
                checked={clearExisting}
                onChange={(e) => setClearExisting(e.target.checked)}
                disabled={importing}
              />
              <label htmlFor="clearExisting" className="text-sm">
                Limpar dados existentes antes de importar
              </label>
            </div>

            {importing && progress > 0 && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  {Math.round(progress)}% concluído
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                {importing ? "Importando..." : "Importar Dados"}
              </Button>

              <Button
                onClick={handleClearData}
                disabled={importing}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Prepare seu arquivo JSON com os dados no formato correto</p>
            <p><strong>2.</strong> Para arquivos grandes (50MB+), divida em arquivos menores de 10-20MB</p>
            <p><strong>3.</strong> Selecione o arquivo e clique em "Importar Dados"</p>
            <p><strong>4.</strong> Aguarde a conclusão do processo (pode levar alguns minutos)</p>
            <p><strong>5.</strong> O dashboard será atualizado automaticamente com os novos dados</p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}