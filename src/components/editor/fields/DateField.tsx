'use client';

import { cn } from '@/utils/cv.utils';

export interface DateFieldProps {
  startDate: string;
  endDate: string;
  current: boolean;
  onChange: (startDate: string, endDate: string, current: boolean) => void;
  className?: string;
}

const MONTHS = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 51 }, (_, index) => String(CURRENT_YEAR - index));

function parseYearMonth(value: string): { year: string; month: string } {
  const [year = '', month = ''] = value.split('-');
  return { year, month };
}

function combineYearMonth(year: string, month: string): string {
  if (!year || !month) return '';
  return `${year}-${month}`;
}

interface DatePartSelectsProps {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function DatePartSelects({ label, value, disabled, onChange }: DatePartSelectsProps) {
  const { year, month } = parseYearMonth(value);

  const updateMonth = (nextMonth: string) => {
    onChange(combineYearMonth(year, nextMonth));
  };

  const updateYear = (nextYear: string) => {
    onChange(combineYearMonth(nextYear, month));
  };

  return (
    <fieldset className="flex flex-col gap-1.5" disabled={disabled}>
      <legend className="text-xs font-medium text-slate-600">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={month}
          disabled={disabled}
          onChange={(event) => updateMonth(event.target.value)}
          className={selectClassName}
          aria-label={`${label} — mois`}
        >
          <option value="">Mois</option>
          {MONTHS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={year}
          disabled={disabled}
          onChange={(event) => updateYear(event.target.value)}
          className={selectClassName}
          aria-label={`${label} — année`}
        >
          <option value="">Année</option>
          {YEARS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}

const selectClassName = cn(
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900',
  'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
);

export function DateField({
  startDate,
  endDate,
  current,
  onChange,
  className,
}: DateFieldProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <DatePartSelects
        label="Date de début"
        value={startDate}
        onChange={(nextStart) => onChange(nextStart, endDate, current)}
      />
      <DatePartSelects
        label="Date de fin"
        value={endDate}
        disabled={current}
        onChange={(nextEnd) => onChange(startDate, nextEnd, current)}
      />
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={current}
          onChange={(event) =>
            onChange(startDate, event.target.checked ? '' : endDate, event.target.checked)
          }
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        Poste actuel
      </label>
    </div>
  );
}
