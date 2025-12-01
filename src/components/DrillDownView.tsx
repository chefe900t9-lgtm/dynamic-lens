import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AggregatedData } from "@/utils/dataProcessor";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChevronRight } from "lucide-react";

interface DrillDownViewProps {
  title: string;
  description: string;
  data: AggregatedData[];
  onItemClick?: (item: string) => void;
  colorIndex?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const DrillDownView = ({
  title,
  description,
  data,
  onItemClick,
  colorIndex = 0,
  showLabels = true,
  showPercentage = true,
}: DrillDownViewProps) => {
  const topData = data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={topData} margin={{ top: 30, right: 10, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis tick={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage.toFixed(1)}%)`,
                "BD'S",
              ]}
            />
            <Bar
              dataKey="value"
              fill={COLORS[colorIndex % COLORS.length]}
              radius={[4, 4, 0, 0]}
              cursor={onItemClick ? "pointer" : "default"}
              onClick={(data) => onItemClick && onItemClick(data.name)}
            >
              {topData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[(colorIndex + index) % COLORS.length]}
                />
              ))}
              {showLabels && (
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: number, entry: any, index: number) => {
                    if (!showPercentage) return value;
                    const item = topData[index];
                    return item ? `${value} (${item.percentage.toFixed(1)}%)` : value;
                  }}
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    fill: 'hsl(var(--foreground))'
                  }}
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {topData.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                onItemClick ? "hover:bg-accent/10 cursor-pointer" : ""
              }`}
              onClick={() => onItemClick && onItemClick(item.name)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[(colorIndex + index) % COLORS.length] }}
                />
                <span className="text-sm font-medium truncate max-w-[300px]">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {item.value} ({item.percentage.toFixed(1)}%)
                </span>
                {onItemClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
