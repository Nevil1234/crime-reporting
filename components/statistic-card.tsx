import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatisticCardProps {
  title: string
  value: string
  change: string
  icon: ReactNode
  trend: "up" | "down"
}

export default function StatisticCard({ title, value, change, icon, trend }: StatisticCardProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">{icon}</div>
          {trend === "up" ? (
            <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </div>
          ) : (
            <div className="flex items-center text-red-600 dark:text-red-400 text-xs font-medium">
              <TrendingDown className="h-3 w-3 mr-1" />
              {change}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

