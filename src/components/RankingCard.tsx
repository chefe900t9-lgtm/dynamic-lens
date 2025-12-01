import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Badge } from "@/components/ui/badge";

interface RankingItem {
  rank: number;
  name: string;
  value: number;
  percentage: number;
}

interface RankingCardProps {
  title: string;
  description?: string;
  data: RankingItem[];
  color?: string;
  topN?: number;
}

export const RankingCard = ({
  title,
  description,
  data,
  color = "hsl(var(--primary))",
  topN = 10,
}: RankingCardProps) => {
  const topData = data.slice(0, topN);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">{data.length} itens</Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topData} margin={{ top: 30, right: 10, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs"
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <YAxis tick={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage.toFixed(1)}%)`,
                "BD'S",
              ]}
            />
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: number, entry: any, index: number) => {
                  const item = topData[index];
                  return item ? `${value} (${item.percentage.toFixed(1)}%)` : value;
                }}
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  fill: 'hsl(var(--foreground))'
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-2">
          {topData.slice(0, 5).map((item) => (
            <div
              key={item.rank}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                  style={{
                    backgroundColor: item.rank <= 3 ? color : "hsl(var(--muted-foreground))",
                  }}
                >
                  {item.rank}
                </div>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{item.value}</span>
                <span className="text-xs text-muted-foreground">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
