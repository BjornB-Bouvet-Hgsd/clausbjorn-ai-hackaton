import { FinancialYear } from '../services/api';

function fmt(value: number | undefined): string {
  if (value == null) return '–';
  return new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(value);
}

export default function FinancialTable({ years }: { years: FinancialYear[] }) {
  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 6, border: '1px solid #E0E0DE', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '1rem', color: '#1D1D1B' }}>Økonomi</h3>
      <table className="financial-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #E0E0DE', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nøkkeltall</th>
            {years.map((y) => (
              <th key={y.aar} style={{ padding: '0.5rem 1rem' }}>{y.aar}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <Row label="Driftsinntekter" years={years} field="sumInntekter" />
          <Row label="Driftsresultat" years={years} field="driftsresultat" />
          <Row label="Årsresultat" years={years} field="aarsresultat" highlight />
          <Row label="Sum eiendeler" years={years} field="sumEiendeler" />
          <Row label="Egenkapital" years={years} field="sumEgenkapital" />
          <Row label="Gjeld" years={years} field="sumGjeld" />
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, years, field, highlight }: {
  label: string;
  years: FinancialYear[];
  field: keyof FinancialYear;
  highlight?: boolean;
}) {
  return (
    <tr style={{ borderBottom: '1px solid #F0F0EE' }}>
      <td style={{ padding: '0.5rem', fontWeight: highlight ? 600 : 400 }}>{label}</td>
      {years.map((y) => (
        <td key={y.aar} style={{ textAlign: 'right', padding: '0.5rem 1rem', fontWeight: highlight ? 600 : 400 }}>
          {fmt(y[field] as number | undefined)}
        </td>
      ))}
    </tr>
  );
}
