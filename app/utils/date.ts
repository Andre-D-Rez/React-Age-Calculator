export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(month: number, year: number): number {
  if (month < 1 || month > 12) return 31;
  const days = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return days[month - 1];
}

export function isValidDate(day: number, month: number, year: number): boolean {
  if (
    !Number.isFinite(day) ||
    !Number.isFinite(month) ||
    !Number.isFinite(year)
  )
    return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > getDaysInMonth(month, year)) return false;
  return true;
}

export type YMD = { years: number; months: number; days: number };

// Diferença entre a data de nascimento (dia, mês, ano) e a data de referência (hoje)
export function diffYMD(
  from: { day: number; month: number; year: number },
  toDate: Date = new Date()
): YMD {
  let y = toDate.getFullYear() - from.year;
  let m = toDate.getMonth() + 1 - from.month; // Meses do JS vão de 0 a 11
  let d = toDate.getDate() - from.day;

  if (d < 0) {
    // empresta do mês anterior
    m -= 1;
    const prevMonth = ((toDate.getMonth() + 11) % 12) + 1; // 1..12
    const prevYear =
      prevMonth === 12 ? toDate.getFullYear() - 1 : toDate.getFullYear();
    d += getDaysInMonth(prevMonth, prevYear);
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  return { years: y, months: m, days: d };
}
