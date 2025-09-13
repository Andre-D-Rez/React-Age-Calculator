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
  // Avoid relying on JS Date range (which can't represent very large/small years reliably)
  // At this point, month/day bounds are guaranteed valid for the given year.
  return true;
}

export type YMD = { years: number; months: number; days: number };

// Difference from birth (y,m,d) to reference date (today by default)
export function diffYMD(
  from: { day: number; month: number; year: number },
  toDate: Date = new Date()
): YMD {
  let y = toDate.getFullYear() - from.year;
  let m = toDate.getMonth() + 1 - from.month; // JS months 0-11
  let d = toDate.getDate() - from.day;

  if (d < 0) {
    // borrow from previous month
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
