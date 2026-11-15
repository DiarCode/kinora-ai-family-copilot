import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

export const DATE_KEY_FORMAT = "yyyy-MM-dd";

export function toDateKey(date: Date): string {
  return format(date, DATE_KEY_FORMAT);
}

export function todayKey(now: Date = new Date()): string {
  return toDateKey(now);
}

export function dateKeyOffset(days: number, now: Date = new Date()): string {
  return toDateKey(addDays(now, days));
}

export function parseDateKey(key: string): Date {
  // Noon avoids most daylight-saving edge cases when we only care about a day.
  const date = parseISO(key);
  date.setHours(12, 0, 0, 0);
  return date;
}

export function formatDayShort(key: string): string {
  return format(parseDateKey(key), "EEE");
}

export function formatDayNumber(key: string): string {
  return format(parseDateKey(key), "d");
}

export function formatFriendlyDate(key: string): string {
  return format(parseDateKey(key), "MMM d");
}

export function formatFriendlyDateTime(iso: string): string {
  const date = new Date(iso);
  return format(date, "EEE, MMM d · h:mm a");
}

export function formatTime(iso: string): string {
  return format(new Date(iso), "h:mm a");
}

export function relativeDayLabel(key: string, now: Date = new Date()): string {
  const diff = differenceInCalendarDays(parseDateKey(key), parseDateKey(todayKey(now)));
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  if (diff < 0 && diff > -7) return formatDayShort(key);
  return formatFriendlyDate(key);
}

export function daysSince(iso: string, now: Date = new Date()): number {
  return Math.max(
    0,
    differenceInCalendarDays(now, new Date(iso)),
  );
}

export function ageFromBirthDate(birthDate: string, now: Date = new Date()): number {
  const birth = parseDateKey(birthDate);
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return Math.max(0, age);
}

export function addDaysToKey(key: string, days: number): string {
  return toDateKey(addDays(parseDateKey(key), days));
}

export function retakeDateKey(days = 90, now: Date = new Date()): string {
  return toDateKey(addDays(now, days));
}

export function isProfileStale(
  retakeAfter: string,
  now: Date = new Date(),
): boolean {
  return differenceInCalendarDays(parseDateKey(todayKey(now)), parseDateKey(retakeAfter)) >= 0;
}

export function lastNDays(n: number, now: Date = new Date()): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    days.push(dateKeyOffset(-i, now));
  }
  return days;
}

export function birthDateForAge(age: number, now: Date = new Date()): string {
  const date = new Date(now);
  date.setFullYear(date.getFullYear() - age);
  date.setMonth(date.getMonth() - 2);
  return toDateKey(date);
}

export function timeLabel(minutesFromMidnight: number): string {
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return format(date, "h:mm a");
}
