import { CalendarDay } from '@/types';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CalendarGridProps {
  days: CalendarDay[];
  selectedDate: Date | null;
  onDayClick: (day: CalendarDay) => void;
}

export function CalendarGrid({ days, selectedDate, onDayClick }: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventColor = (color?: string) => {
    switch (color) {
      case 'work':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'personal':
        return 'bg-green-100 text-green-900 border-green-200';
      case 'other':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="grid grid-cols-7 gap-px border-b bg-muted">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-background p-3 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-muted">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              'relative min-h-[120px] p-2 bg-background transition-colors',
              !day.isCurrentMonth && 'bg-muted/50',
              day.isToday && 'bg-primary/5',
              selectedDate &&
                day.date.toDateString() === selectedDate.toDateString() &&
                'bg-primary/10',
              'hover:bg-accent cursor-pointer'
            )}
            onClick={() => onDayClick(day)}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'text-sm font-medium',
                  !day.isCurrentMonth && 'text-muted-foreground',
                  day.isToday && 'text-primary'
                )}
              >
                {day.date.getDate()}
              </span>
              {day.events.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{day.events.length}</span>
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {day.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'text-xs px-2 py-1 rounded-md border',
                    getEventColor(event.color)
                  )}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-[10px] opacity-80">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-muted-foreground px-2">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}