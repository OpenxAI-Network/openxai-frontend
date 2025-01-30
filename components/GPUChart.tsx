'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const costComparisonData = [
  { provider: 'AWS H100', cost: 3.05 },
  { provider: 'Google Cloud H100', cost: 2.48 },
  { provider: 'Azure H100', cost: 3.05 },
  { provider: 'Vultr Cloud H100', cost: 2.30 },
  { provider: 'Deeplink H100', cost: 1.85 }
];

export function GPUChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <BarChart data={costComparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="provider" angle={-45} textAnchor="end" height={60} />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value) => [`$${value}`, 'Cost per Hour']} />
          <Bar dataKey="cost" fill="#1e40af">
            {costComparisonData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.provider === 'Deeplink H100' ? '#22c55e' : '#1e40af'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}