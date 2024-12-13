import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Event } from '@/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EventListProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedDate: Date;
}

export function EventList({
  isOpen,
  onClose,
  events,
  onEditEvent,
  onDeleteEvent,
  selectedDate,
}: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventColor = (color: Event['color']) => {
    switch (color) {
      case 'work':
        return 'bg-blue-100 border-blue-300';
      case 'personal':
        return 'bg-green-100 border-green-300';
      case 'other':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Events for {selectedDate.toLocaleDateString()}</SheetTitle>
          <SheetDescription>
            Manage your events for this day
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No events found
              </p>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    getEventColor(event.color)
                  )}
                >
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {event.startTime} - {event.endTime}
                  </p>
                  {event.description && (
                    <p className="text-sm mt-2">{event.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}