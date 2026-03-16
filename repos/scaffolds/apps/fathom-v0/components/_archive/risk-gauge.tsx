"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { riskCategories } from "@/lib/risk-data"
import { Badge } from "@/components/ui/badge"

function getSeverityVariant(level: string) {
  switch (level) {
    case "Critical":
      return "destructive"
    case "High":
      return "default"
    case "Moderate":
      return "secondary"
    default:
      return "outline"
  }
}

export function RiskGauge() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
        <CardDescription>Current risk levels by category</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {riskCategories.map((category) => (
          <div key={category.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{category.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant={getSeverityVariant(category.level)} className="text-[10px] px-1.5 py-0">
                  {category.level}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground tabular-nums">
                  {category.score}/100
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${category.score}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
