'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartType } from '@/lib/types/dashboard'

// Sample data for different chart types
const timelineData = [
  { name: 'Jan', value: 65, prev: 55 },
  { name: 'Feb', value: 78, prev: 62 },
  { name: 'Mar', value: 90, prev: 70 },
  { name: 'Apr', value: 81, prev: 75 },
  { name: 'May', value: 56, prev: 58 },
  { name: 'Jun', value: 55, prev: 48 },
  { name: 'Jul', value: 40, prev: 42 },
]

const categoryData = [
  { name: 'Infrastructure', value: 35 },
  { name: 'Public Safety', value: 28 },
  { name: 'Traffic', value: 22 },
  { name: 'Health', value: 15 },
  { name: 'Environmental', value: 12 },
]

const riskData = [
  { name: 'Critical', value: 8, fill: 'var(--risk-critical)' },
  { name: 'High', value: 15, fill: 'var(--risk-high)' },
  { name: 'Medium', value: 32, fill: 'var(--risk-medium)' },
  { name: 'Low', value: 28, fill: 'var(--risk-low)' },
  { name: 'Minimal', value: 17, fill: 'var(--risk-minimal)' },
]

const radarData = [
  { zone: 'Zone 1', risk: 75, incidents: 45, response: 85 },
  { zone: 'Zone 2', risk: 55, incidents: 65, response: 70 },
  { zone: 'Zone 3', risk: 90, incidents: 80, response: 60 },
  { zone: 'Zone 4', risk: 40, incidents: 30, response: 90 },
  { zone: 'Zone 5', risk: 65, incidents: 55, response: 75 },
  { zone: 'Zone 6', risk: 45, incidents: 35, response: 95 },
]

const heatmapData = Array.from({ length: 7 }, (_, day) => ({
  day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
  ...Object.fromEntries(
    Array.from({ length: 24 }, (_, hour) => [
      `h${hour}`,
      Math.floor(Math.random() * 100),
    ])
  ),
}))

interface DemoChartProps {
  chartType: ChartType
  dataKey: string
}

export function DemoChart({ chartType, dataKey }: DemoChartProps) {
  switch (chartType) {
    case 'area':
      return <AreaChartDemo />
    case 'line':
      return <LineChartDemo />
    case 'bar':
      return <BarChartDemo />
    case 'stacked-bar':
      return <StackedBarChartDemo />
    case 'pie':
      return <PieChartDemo />
    case 'donut':
      return <DonutChartDemo />
    case 'radar':
      return <RadarChartDemo />
    case 'gauge-arc':
      return <GaugeArcDemo />
    case 'gauge-radial':
      return <GaugeRadialDemo />
    case 'gauge-linear':
      return <GaugeLinearDemo />
    case 'wind-rose':
      return <WindRoseDemo />
    case 'compass':
      return <CompassDemo />
    case 'timeline-heatmap':
      return <TimelineHeatmapDemo />
    case 'scatter':
      return <ScatterChartDemo />
    case 'treemap':
      return <TreemapDemo />
    case 'funnel':
      return <FunnelDemo />
    case 'bullet':
      return <BulletChartDemo />
    case 'sankey':
      return <SankeyDemo />
    default:
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Chart type: {chartType}
        </div>
      )
  }
}

function AreaChartDemo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={timelineData}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'var(--foreground)' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          fillOpacity={1}
          fill="url(#colorValue)"
          strokeWidth={2}
          name="Current"
        />
        <Area
          type="monotone"
          dataKey="prev"
          stroke="var(--chart-2)"
          fillOpacity={1}
          fill="url(#colorPrev)"
          strokeWidth={2}
          name="Previous"
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function LineChartDemo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ fill: 'var(--chart-1)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function BarChartDemo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={categoryData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={90} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function DonutChartDemo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={riskData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {riskData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

function RadarChartDemo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={radarData}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="zone" stroke="var(--muted-foreground)" fontSize={11} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={10} />
        <Radar
          name="Risk Level"
          dataKey="risk"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0.3}
        />
        <Radar
          name="Incidents"
          dataKey="incidents"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          fillOpacity={0.3}
        />
        <Legend />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

function GaugeArcDemo() {
  const value = 72 // Current response time score
  const maxValue = 100
  const percentage = (value / maxValue) * 100
  
  // Calculate color based on value
  const getColor = () => {
    if (percentage >= 80) return 'var(--status-active)'
    if (percentage >= 60) return 'var(--risk-medium)'
    if (percentage >= 40) return 'var(--risk-high)'
    return 'var(--risk-critical)'
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="10"
            strokeDasharray="188.5 251.3"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeDasharray={`${percentage * 1.885} 251.3`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-xs text-muted-foreground">Score</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-status-active" />
          Good
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-risk-medium" />
          Fair
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-risk-critical" />
          Poor
        </span>
      </div>
    </div>
  )
}

function TimelineHeatmapDemo() {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getIntensityColor = (value: number) => {
    if (value >= 80) return 'bg-risk-critical'
    if (value >= 60) return 'bg-risk-high'
    if (value >= 40) return 'bg-risk-medium'
    if (value >= 20) return 'bg-risk-low'
    return 'bg-risk-minimal/50'
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 gap-1">
        <div className="flex flex-col justify-around pr-2 text-[10px] text-muted-foreground">
          {days.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {heatmapData.map((row, dayIndex) => (
            <div key={dayIndex} className="flex flex-1 gap-0.5">
              {hours.map((hour) => {
                const value = row[`h${hour}`] as number
                return (
                  <div
                    key={hour}
                    className={`flex-1 rounded-sm ${getIntensityColor(value)} transition-colors hover:opacity-80`}
                    title={`${days[dayIndex]} ${hour}:00 - ${value} incidents`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>11pm</span>
      </div>
    </div>
  )
}

function StackedBarChartDemo() {
  const data = [
    { name: 'Zone 1', critical: 4, high: 8, medium: 12, low: 6 },
    { name: 'Zone 2', critical: 2, high: 5, medium: 15, low: 10 },
    { name: 'Zone 3', critical: 6, high: 10, medium: 8, low: 4 },
    { name: 'Zone 4', critical: 1, high: 3, medium: 18, low: 12 },
    { name: 'Zone 5', critical: 3, high: 7, medium: 14, low: 8 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="critical" stackId="a" fill="var(--risk-critical)" name="Critical" />
        <Bar dataKey="high" stackId="a" fill="var(--risk-high)" name="High" />
        <Bar dataKey="medium" stackId="a" fill="var(--risk-medium)" name="Medium" />
        <Bar dataKey="low" stackId="a" fill="var(--risk-low)" name="Low" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function PieChartDemo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={riskData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {riskData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function GaugeRadialDemo() {
  const value = 85
  const segments = [
    { value: 25, color: 'var(--risk-critical)' },
    { value: 25, color: 'var(--risk-high)' },
    { value: 25, color: 'var(--risk-medium)' },
    { value: 25, color: 'var(--status-active)' },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--muted)" strokeWidth="8" />
          {/* Value arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="8"
            strokeDasharray={`${(value / 100) * 283} 283`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
          {/* Inner value */}
          <text x="50" y="45" textAnchor="middle" className="fill-foreground text-2xl font-bold">
            {value}%
          </text>
          <text x="50" y="60" textAnchor="middle" className="fill-muted-foreground text-[10px]">
            Efficiency
          </text>
        </svg>
      </div>
    </div>
  )
}

function GaugeLinearDemo() {
  const metrics = [
    { label: 'Response Time', value: 78, target: 90 },
    { label: 'Resolution Rate', value: 92, target: 85 },
    { label: 'Coverage Area', value: 65, target: 80 },
  ]

  return (
    <div className="flex h-full flex-col justify-center gap-4 px-2">
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-medium">{metric.value}%</span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-muted">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
              style={{
                width: `${metric.value}%`,
                backgroundColor: metric.value >= metric.target ? 'var(--status-active)' : 'var(--risk-medium)',
              }}
            />
            <div
              className="absolute top-0 h-full w-0.5 bg-foreground"
              style={{ left: `${metric.target}%` }}
              title={`Target: ${metric.target}%`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function WindRoseDemo() {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const data = directions.map((dir, i) => ({
    direction: dir,
    angle: i * 45,
    value: 20 + Math.random() * 60,
  }))

  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          {/* Background circles */}
          {[25, 50, 75, 100].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r * 0.8}
              fill="none"
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
          ))}
          {/* Direction lines */}
          {data.map((d) => (
            <line
              key={d.direction}
              x1="100"
              y1="100"
              x2={100 + 80 * Math.sin((d.angle * Math.PI) / 180)}
              y2={100 - 80 * Math.cos((d.angle * Math.PI) / 180)}
              stroke="var(--border)"
            />
          ))}
          {/* Value wedges */}
          {data.map((d, i) => {
            const angle1 = ((d.angle - 22.5) * Math.PI) / 180
            const angle2 = ((d.angle + 22.5) * Math.PI) / 180
            const r = (d.value / 100) * 80
            return (
              <path
                key={d.direction}
                d={`M 100 100 L ${100 + r * Math.sin(angle1)} ${100 - r * Math.cos(angle1)} A ${r} ${r} 0 0 1 ${100 + r * Math.sin(angle2)} ${100 - r * Math.cos(angle2)} Z`}
                fill="var(--chart-1)"
                fillOpacity={0.6}
                stroke="var(--chart-1)"
                strokeWidth={1}
              />
            )
          })}
          {/* Direction labels */}
          {data.map((d) => (
            <text
              key={`label-${d.direction}`}
              x={100 + 90 * Math.sin((d.angle * Math.PI) / 180)}
              y={100 - 90 * Math.cos((d.angle * Math.PI) / 180)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {d.direction}
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

function CompassDemo() {
  const heading = 127 // Current heading in degrees

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="2" />
          {/* Degree marks */}
          {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => (
            <line
              key={deg}
              x1={50 + 40 * Math.sin((deg * Math.PI) / 180)}
              y1={50 - 40 * Math.cos((deg * Math.PI) / 180)}
              x2={50 + (deg % 30 === 0 ? 35 : 38) * Math.sin((deg * Math.PI) / 180)}
              y2={50 - (deg % 30 === 0 ? 35 : 38) * Math.cos((deg * Math.PI) / 180)}
              stroke="var(--muted-foreground)"
              strokeWidth={deg % 90 === 0 ? 2 : 1}
            />
          ))}
          {/* Cardinal directions */}
          {['N', 'E', 'S', 'W'].map((dir, i) => (
            <text
              key={dir}
              x={50 + 30 * Math.sin((i * 90 * Math.PI) / 180)}
              y={50 - 30 * Math.cos((i * 90 * Math.PI) / 180)}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-bold ${dir === 'N' ? 'fill-risk-critical' : 'fill-foreground'}`}
            >
              {dir}
            </text>
          ))}
          {/* Heading needle */}
          <g transform={`rotate(${heading} 50 50)`}>
            <polygon points="50,15 47,50 50,45 53,50" fill="var(--chart-1)" />
            <polygon points="50,85 47,50 50,55 53,50" fill="var(--muted-foreground)" />
          </g>
          {/* Center dot */}
          <circle cx="50" cy="50" r="3" fill="var(--foreground)" />
        </svg>
      </div>
      <div className="mt-2 text-center">
        <span className="text-2xl font-bold">{heading}</span>
        <span className="text-sm text-muted-foreground">° SE</span>
      </div>
    </div>
  )
}

function ScatterChartDemo() {
  const data = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 50 + 10,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="x" stroke="var(--muted-foreground)" fontSize={12} name="Risk Score" />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} name="Impact" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="y"
          stroke="var(--chart-1)"
          strokeWidth={0}
          dot={{ fill: 'var(--chart-1)', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function TreemapDemo() {
  const data = [
    { name: 'Infrastructure', value: 35, color: 'var(--chart-1)' },
    { name: 'Safety', value: 28, color: 'var(--chart-2)' },
    { name: 'Traffic', value: 22, color: 'var(--chart-3)' },
    { name: 'Health', value: 15, color: 'var(--chart-4)' },
  ]
  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <div className="flex h-full flex-col gap-1 p-2">
      <div className="flex flex-1 gap-1">
        <div
          className="flex items-end justify-start rounded-lg p-2"
          style={{ flex: data[0].value, backgroundColor: data[0].color }}
        >
          <div className="text-xs font-medium text-white">
            <div>{data[0].name}</div>
            <div className="text-lg font-bold">{((data[0].value / total) * 100).toFixed(0)}%</div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div
            className="flex flex-1 items-end justify-start rounded-lg p-2"
            style={{ backgroundColor: data[1].color }}
          >
            <div className="text-xs font-medium text-white">
              <div>{data[1].name}</div>
              <div className="font-bold">{((data[1].value / total) * 100).toFixed(0)}%</div>
            </div>
          </div>
          <div className="flex flex-1 gap-1">
            {data.slice(2).map((d) => (
              <div
                key={d.name}
                className="flex flex-1 items-end justify-start rounded-lg p-2"
                style={{ backgroundColor: d.color }}
              >
                <div className="text-[10px] font-medium text-white">
                  <div>{d.name}</div>
                  <div className="font-bold">{((d.value / total) * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FunnelDemo() {
  const data = [
    { stage: 'Reported', value: 100, percent: 100 },
    { stage: 'Verified', value: 85, percent: 85 },
    { stage: 'Assigned', value: 72, percent: 72 },
    { stage: 'In Progress', value: 58, percent: 58 },
    { stage: 'Resolved', value: 45, percent: 45 },
  ]

  return (
    <div className="flex h-full flex-col justify-center gap-2 px-4">
      {data.map((d, i) => (
        <div key={d.stage} className="flex items-center gap-3">
          <span className="w-20 text-right text-xs text-muted-foreground">{d.stage}</span>
          <div className="relative flex-1">
            <div
              className="h-6 rounded-r-lg transition-all duration-500"
              style={{
                width: `${d.percent}%`,
                backgroundColor: `var(--chart-${(i % 5) + 1})`,
              }}
            />
          </div>
          <span className="w-10 text-xs font-medium">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

function BulletChartDemo() {
  const metrics = [
    { label: 'Response', actual: 78, target: 85, ranges: [50, 75, 100] },
    { label: 'Resolution', actual: 92, target: 80, ranges: [60, 80, 100] },
    { label: 'Coverage', actual: 65, target: 75, ranges: [40, 70, 100] },
  ]

  return (
    <div className="flex h-full flex-col justify-center gap-4 px-2">
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-medium">{metric.actual}%</span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded bg-muted">
            {/* Range backgrounds */}
            <div className="absolute inset-0 flex">
              <div className="h-full bg-risk-low/30" style={{ width: `${metric.ranges[0]}%` }} />
              <div className="h-full bg-risk-medium/30" style={{ width: `${metric.ranges[1] - metric.ranges[0]}%` }} />
              <div className="h-full bg-status-active/30" style={{ width: `${metric.ranges[2] - metric.ranges[1]}%` }} />
            </div>
            {/* Actual value bar */}
            <div
              className="absolute left-0 top-1 h-2 rounded bg-foreground transition-all duration-500"
              style={{ width: `${metric.actual}%` }}
            />
            {/* Target marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-destructive"
              style={{ left: `${metric.target}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SankeyDemo() {
  // Simplified Sankey visualization using rectangles and curves
  const sources = ['Critical', 'High', 'Medium']
  const targets = ['Resolved', 'In Progress', 'Pending']
  
  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 300 200" className="h-full w-full">
        {/* Source nodes */}
        {sources.map((source, i) => (
          <g key={source}>
            <rect
              x="20"
              y={30 + i * 60}
              width="60"
              height="40"
              rx="4"
              fill={`var(--risk-${source.toLowerCase()})`}
              fillOpacity={0.8}
            />
            <text x="50" y={55 + i * 60} textAnchor="middle" className="fill-white text-[10px] font-medium">
              {source}
            </text>
          </g>
        ))}
        {/* Target nodes */}
        {targets.map((target, i) => (
          <g key={target}>
            <rect
              x="220"
              y={30 + i * 60}
              width="60"
              height="40"
              rx="4"
              fill="var(--chart-1)"
              fillOpacity={0.8}
            />
            <text x="250" y={55 + i * 60} textAnchor="middle" className="fill-white text-[10px] font-medium">
              {target}
            </text>
          </g>
        ))}
        {/* Flow paths (simplified) */}
        <path
          d="M 80 50 C 150 50, 150 50, 220 50"
          fill="none"
          stroke="var(--risk-critical)"
          strokeWidth="15"
          strokeOpacity="0.3"
        />
        <path
          d="M 80 110 C 150 110, 150 80, 220 80"
          fill="none"
          stroke="var(--risk-high)"
          strokeWidth="12"
          strokeOpacity="0.3"
        />
        <path
          d="M 80 170 C 150 170, 150 140, 220 140"
          fill="none"
          stroke="var(--risk-medium)"
          strokeWidth="10"
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  )
}
