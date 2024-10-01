import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

type MetricCardProps = {
    title: string
    value: string
    change: number
    icon: React.ReactNode
  }
export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {change > 0 ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
          )}
          {Math.abs(change)}% from last month
        </p>
      </CardContent>
    </Card>
  )