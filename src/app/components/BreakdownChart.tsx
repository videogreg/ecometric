'use client';

type BreakdownChartProps = {
  breakdown: Record<string, number>;
};

export default function BreakdownChart({ breakdown }: BreakdownChartProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const colors: Record<string, string> = {
    'Home Heating': '#ef4444',    // red
    'Electricity': '#f59e0b',     // amber
    'Transportation': '#3b82f6',  // blue
    'Flights': '#8b5cf6',         // purple
    'Diet': '#10b981',            // emerald
    'Goods & Services': '#6b7280' // gray
  };

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-bold text-gray-700 mb-2">Where Your Emissions Come From</h3>
      {Object.entries(breakdown).map(([category, value]) => {
        const pct = ((value / total) * 100).toFixed(0);
        return (
          <div key={category} className="flex items-center gap-2">
            <div className="w-24 text-xs text-gray-600 text-right truncate">{category}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${pct}%`, 
                  backgroundColor: colors[category] || '#059669' 
                }}
              />
            </div>
            <div className="w-16 text-xs font-semibold text-gray-700">{value.toFixed(1)}t ({pct}%)</div>
          </div>
        );
      })}
    </div>
  );
}