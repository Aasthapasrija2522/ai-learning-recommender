import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function ProgressChart({ completed, total }) {
  const remaining = total - completed;

  const data = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: remaining },
  ];

  const COLORS = ['#2563eb', '#e5e7eb'];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressChart;