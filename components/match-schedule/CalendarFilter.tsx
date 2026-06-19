'use client';

interface Calendar {
  id: string;
  name: string;
}

interface CalendarFilterProps {
  calendars: Calendar[];
  selectedCalendar: string | null;
  onSelect: (calendarId: string | null) => void;
  showAllButton?: boolean;
}

export default function CalendarFilter({ calendars, selectedCalendar, onSelect, showAllButton = true }: CalendarFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
      {showAllButton && (
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-button whitespace-nowrap transition-colors ${
            selectedCalendar === null
              ? 'bg-suwon-red text-white font-bold'
              : 'bg-suwon-cardDark text-suwon-textSecondary hover:bg-suwon-navy'
          }`}
        >
          전체
        </button>
      )}
      {calendars.map((calendar) => (
        <button
          key={calendar.id}
          onClick={() => onSelect(calendar.id)}
          className={`px-4 py-2 rounded-button whitespace-nowrap transition-colors ${
            selectedCalendar === calendar.id
              ? 'bg-suwon-red text-white font-bold'
              : 'bg-suwon-cardDark text-suwon-textSecondary hover:bg-suwon-navy'
          }`}
        >
          {calendar.name}
        </button>
      ))}
    </div>
  );
}