import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsightsCardProps {
  title: string;
  description: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  color?: string;
}

export const InsightsCard = ({
  title,
  description,
  value,
  icon: Icon,
  trend,
  color = "hsl(var(--primary))",
}: InsightsCardProps) => {
  const getTrendBadge = () => {
    if (!trend) return null;
    
    const badges = {
      up: { text: "↑ Crescimento", className: "bg-green-500/10 text-green-600 dark:text-green-400" },
      down: { text: "↓ Redução", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
      stable: { text: "→ Estável", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    };
    
    const badge = badges[trend];
    return <Badge variant="secondary" className={badge.className}>{badge.text}</Badge>;
  };

  return (
    <Card className="hover-scale">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div 
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-foreground">{title}</h4>
              {getTrendBadge()}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
