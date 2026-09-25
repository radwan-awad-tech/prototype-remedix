import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { chartLabel } from './chartLabels';

interface Props {
  data: { name: string; count?: number; value?: number }[];
  dataKey: 'count' | 'value';
  language: 'ar' | 'en';
  metricLabel: string;
  color?: string;
  amount?: boolean;
}

/** Keep SVG coordinates LTR; isolate translated labels in HTML to avoid bidi text-anchor shifts. */
export const LocalizedBarChart: React.FC<Props> = ({ data, dataKey, language, metricLabel, color = '#004D4D', amount = false }) => {
  const rtl = language === 'ar';
  const locale = rtl ? 'ar-SY' : 'en-US';
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: amount ? 2 : 0 });
  const compact = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 });
  const labelWidth = 136;
  const translated = data.map(row => ({ ...row, name: chartLabel(row.name, language) }));
  const CategoryTick = ({ x = 0, y = 0, payload }: any) => (
    <foreignObject x={rtl ? x + 8 : x - labelWidth} y={y - 24} width={labelWidth - 8} height={48}>
      <div dir={rtl ? 'rtl' : 'ltr'} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: rtl ? 'flex-start' : 'flex-end', textAlign: rtl ? 'right' : 'left', fontSize: 12, lineHeight: '18px', color: '#475569', overflowWrap: 'anywhere' }}>
        {payload?.value}
      </div>
    </foreignObject>
  );
  return <div dir="ltr" style={{ direction: 'ltr', minWidth: 0, width: '100%', height: Math.max(200, translated.length * 58 + 40) }}>
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <BarChart key={language} data={translated} layout="vertical" margin={{ top: 8, right: 12, bottom: 8, left: 12 }} accessibilityLayer>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis type="number" reversed={rtl} allowDecimals={amount} tickFormatter={value => compact.format(Number(value))} tick={{ fontSize: 11, direction: 'ltr' }} tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis type="category" dataKey="name" orientation={rtl ? 'right' : 'left'} width={labelWidth} interval={0} tick={<CategoryTick />} tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: '#004D4D08' }} content={({ active, payload, label }) => active && payload?.length ? (
          <div dir={rtl ? 'rtl' : 'ltr'} className="rounded-xl border border-border-base bg-white p-3 shadow-md" style={{ textAlign: rtl ? 'right' : 'left', maxWidth: 260 }}>
            <p className="font-semibold mb-1">{label}</p>
            <p className="text-sm">{metricLabel}: <bdi>{number.format(Number(payload[0].value))}</bdi></p>
          </div>
        ) : null} />
        <Bar dataKey={dataKey} name={metricLabel} fill={color} maxBarSize={24} radius={rtl ? [5, 0, 0, 5] : [0, 5, 5, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
};
