import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventDialog } from '@/components/EventDialog';
import { EventList } from '@/components/EventList';
import { CalendarHeader } from '@/components/CalendarHeader';
import { CalendarGrid } from '@/components/CalendarGrid';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CalendarDay, Event } from '@/types';
import { generateCalendarDays, formatDate } from '@/lib/calendar';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useLocalStorage<Event[]>('calendar-events', []);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventListOpen, setIsEventListOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Generate calendar days with events
  const days = generateCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  ).map(day => ({
    ...day,
    events: events.filter(event => event.date === formatDate(day.date))
  }));

  // Filter days based on search term
  const filteredDays = searchTerm
    ? days.map(day => ({
        ...day,
        events: day.events.filter(
          event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
    : days;

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    setIsEventListOpen(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
    setIsEventListOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? { ...eventData, id: event.id }
          : event
      ));
    } else {
      setEvents([...events, { ...eventData, id: crypto.randomUUID() }]);
    }
    setIsEventDialogOpen(false);
  };

  const handleExportEvents = () => {
    const currentMonthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const exportData = JSON.stringify(currentMonthEvents, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-events-${currentDate.toISOString().slice(0, 7)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl calendar-container p-6 sm:p-8">
        <CalendarHeader
          currentDate={currentDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onExport={handleExportEvents}
          onPrevMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <div className="mt-8">
          <CalendarGrid
            days={filteredDays}
            selectedDate={selectedDate}
            onDayClick={handleDayClick}
          />
        </div>

        {selectedDate && (
          <>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleAddEvent} className="bg-primary/90 hover:bg-primary">
                Add Event
              </Button>
            </div>

            <EventDialog
              isOpen={isEventDialogOpen}
              onClose={() => setIsEventDialogOpen(false)}
              onSave={handleSaveEvent}
              selectedDate={selectedDate}
              existingEvents={events}
              editEvent={editingEvent}
            />

            <EventList
              isOpen={isEventListOpen}
              onClose={() => setIsEventListOpen(false)}
              events={events.filter(
                (event) => event.date === formatDate(selectedDate)
              )}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              selectedDate={selectedDate}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;