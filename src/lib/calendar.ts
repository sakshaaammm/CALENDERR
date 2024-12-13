import { CalendarDay, Event } from '@/types';

export function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const today = new Date();
  const days: CalendarDay[] = [];

  // Previous month's days
  const prevMonth = new Date(year, month - 1, 1);
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      events: [],
    });
  }

  // Next month's days
  const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }

  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function checkEventOverlap(
  existingEvents: Event[],
  newEvent: Omit<Event, 'id'>,
  excludeEventId?: string
): boolean {
  const filteredEvents = excludeEventId
    ? existingEvents.filter((event) => event.id !== excludeEventId)
    : existingEvents;

  return filteredEvents.some((event) => {
    const newStart = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const newEnd = new Date(`${newEvent.date}T${newEvent.endTime}`);
    const existingStart = new Date(`${event.date}T${event.startTime}`);
    const existingEnd = new Date(`${event.date}T${event.endTime}`);

    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}