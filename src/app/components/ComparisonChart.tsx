'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type ComparisonChartProps = {
  userScore: number;
};

export default function ComparisonChart({ userScore }: ComparisonChartProps) {
  const data = [
    { name: 'Your Score', value: userScore, color: '#10b981' },
    { name: 'USA Average', value: 16, color: '#6b7280' },
    { name: 'Canada Average', value: 15.6, color: '#6b7280' },
    { name: 'Paris Target', value: 2.5, color: '#3b82f6' },
  ];

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-bold text-gray-700 mb-4">How You Compare (Tonnes CO2/Year)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{fontSize: 12}} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {userScore > 16 
          ? "🚨 You're above North American average - big savings potential!" 
          : userScore > 10 
          ? "⚠️ Room for improvement - solar could help significantly" 
          : "🌟 Excellent! You're below average. Share your tips!"}
      </p>
    </div>
  );
}