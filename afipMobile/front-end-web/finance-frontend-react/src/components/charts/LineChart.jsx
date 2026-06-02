import { LineChart as RechartsLineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

export const LineChart = ({ 
  data, 
  title, 
  dataKey = 'amount',
  color = '#3b82f6',
  height = 300,
  showLegend = false,
  emptyMessage = 'No hay datos suficientes para mostrar la gráfica'
}) => {
  // Custom tooltip with modern design
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-surface p-4 border-2 border-gray-100 dark:border-dark-border rounded-xl shadow-xl backdrop-blur-sm">
          <p className="text-xs font-medium mb-1 text-gray-900 dark:text-text-primary">{payload[0].payload.displayDate}</p>
          <p className="text-xl font-bold" style={{ color }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Generate gradient ID based on color
  const gradientId = `gradient-${color.replace('#', '')}`;

  // Get theme-aware colors using getComputedStyle (works with Tailwind dark mode)
  const getThemeColor = (lightColor, darkColor) => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? darkColor : lightColor;
    }
    return lightColor;
  };

  // Theme-aware chart colors
  const gridColor = getThemeColor('#e5e7eb', '#2A3354');
  const axisColor = getThemeColor('#9ca3af', '#6C737F');
  const tickColor = getThemeColor('#6b7280', '#9AA0A6');

  return (
    <Card>
      <div className="p-4">
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-text-primary">{title}</h3>
        )}
        {!data || data.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
            <p className="text-gray-400 dark:text-text-tertiary text-center font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart 
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={gridColor}
                vertical={false}
                strokeOpacity={0.5}
              />
              <XAxis 
                dataKey="displayDate" 
                stroke={axisColor}
                tick={{ fontSize: 12, fill: tickColor }}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke={axisColor}
                tick={{ fontSize: 12, fill: tickColor }}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }} />
              {showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                dot={{ 
                  fill: '#fff', 
                  stroke: color, 
                  strokeWidth: 3, 
                  r: 5,
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                }}
                activeDot={{ 
                  r: 7, 
                  fill: color,
                  stroke: '#fff',
                  strokeWidth: 3,
                  filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))'
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};



