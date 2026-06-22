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

  // 캘린더별 스타일 클래스 반환
  const getCalendarButtonClass = (calendarId: string, index: number, isSelected: boolean) => {
    if (isSelected) {
      if (index === 0) {
        return 'bg-suwon-red text-white font-bold border-suwon-red shadow-lg shadow-suwon-red/30';
      } else if (index === 1) {
        return 'bg-suwon-blue text-white font-bold border-suwon-blue shadow-lg shadow-suwon-blue/30';
      } else {
        return 'bg-suwon-red text-white font-bold border-suwon-red shadow-lg shadow-suwon-red/30';
      }
    } else {
      return 'bg-suwon-cardDark text-suwon-textSecondary border-transparent hover:bg-suwon-navy hover:border-suwon-red/30';
    }
  };

  export default function CalendarFilter({ calendars, selectedCalendar, onSelect, showAllButton = true }: CalendarFilterProps) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {showAllButton && (
          <button
            onClick={() => onSelect(null)}
            className={`px-4 py-2 rounded-button whitespace-nowrap transition-all duration-300 border-2 ${
              selectedCalendar === null
                ? 'bg-suwon-red text-white font-bold border-suwon-red shadow-lg shadow-suwon-red/30'
                : 'bg-suwon-cardDark text-suwon-textSecondary border-transparent hover:bg-suwon-navy hover:border-suwon-red/30'
            }`}
          >
            전체
          </button>
        )}
        {calendars.map((calendar, index) => {
          const isSelected = selectedCalendar === calendar.id;
          const buttonClass = getCalendarButtonClass(calendar.id, index, isSelected);
          
          return (
            <button
              key={calendar.id}
              onClick={() => onSelect(calendar.id)}
              className={`px-4 py-2 rounded-button whitespace-nowrap transition-all duration-300 border-2 ${buttonClass}`}
            >
              {calendar.name}
            </button>
          );
        })}
      </div>
    );
  }
