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
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#FFFFFF' }}>Utvikling</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" stroke="#C3D5E1" />
          <YAxis tickFormatter={fmtMillions} width={70} stroke="#C3D5E1" />
          <Tooltip formatter={(v) => fmtTooltip(Number(v))} contentStyle={{ background: '#11133C', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#FFFFFF' }} />
          <Legend wrapperStyle={{ color: '#C3D5E1' }} />
          <Bar dataKey="Driftsinntekter" fill="#1D43C6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Driftsresultat" fill="#78FE9C" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Årsresultat" fill="#F9A86F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
