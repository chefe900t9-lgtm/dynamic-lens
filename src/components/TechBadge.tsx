import { Badge } from "@/components/ui/badge";
import { Phone, Wifi, Network } from "lucide-react";

interface TechBadgeProps {
  technology?: string;
  subcategoria?: string;
}

const getTechColor = (tech?: string): string => {
  if (!tech) return "hsl(var(--muted))";
  
  const techUpper = tech.toUpperCase();
  if (techUpper === "VOZ") return "hsl(var(--tech-voz))";
  if (techUpper === "DADOS") return "hsl(var(--tech-dados))";
  return "hsl(var(--primary))";
};

const getSubcategoriaIcon = (subcategoria?: string) => {
  if (!subcategoria) return null;
  
  const subLower = subcategoria.toLowerCase();
  if (subLower.includes("linha")) return <Phone className="h-3 w-3 mr-1" />;
  if (subLower.includes("banda")) return <Wifi className="h-3 w-3 mr-1" />;
  if (subLower.includes("turbonet")) return <Network className="h-3 w-3 mr-1" />;
  return null;
};

export const TechBadge = ({ technology, subcategoria }: TechBadgeProps) => {
  if (!technology && !subcategoria) return null;
  
  return (
    <div className="flex gap-2 items-center">
      {technology && (
        <Badge 
          className="font-medium"
          style={{ 
            backgroundColor: getTechColor(technology),
            color: "white",
            borderColor: getTechColor(technology)
          }}
        >
          {technology}
        </Badge>
      )}
      {subcategoria && (
        <Badge variant="outline" className="flex items-center">
          {getSubcategoriaIcon(subcategoria)}
          {subcategoria}
        </Badge>
      )}
    </div>
  );
};
