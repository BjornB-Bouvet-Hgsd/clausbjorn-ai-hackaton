import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FinancialYear } from '../services/api';

function fmtMillions(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} mill`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
}

function fmtTooltip(value: number): string {
  return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(value);
}

export default function FinancialChart({ years }: { years: FinancialYear[] }) {
  const data = [...years].reverse().map((y) => ({
    name: String(y.aar),
    Driftsinntekter: y.sumInntekter ?? 0,
    Driftsresultat: y.driftsresultat ?? 0,
    Årsresultat: y.aarsresultat ?? 0,
  }));

  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 6, border: '1px solid #E0E0DE', marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#1D1D1B' }}>Utvikling</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={fmtMillions} width={70} />
          <Tooltip formatter={(v) => fmtTooltip(Number(v))} />
          <Legend />
          <Bar dataKey="Driftsinntekter" fill="#E8712B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Driftsresultat" fill="#1D1D1B" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Årsresultat" fill="#F4A261" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
