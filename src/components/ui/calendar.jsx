import React, { useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  format,
  addDays,
} from "date-fns";

export function Calendar({ className = "", selected, onSelect }) {
  const initialDate = selected instanceof Date ? selected : new Date();
  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(initialDate)
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // domingo
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let day = startDate;
  let done = false;

  while (!done) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
    if (day > endDate) {
      done = true;
    }
  }

  const handleSelect = (date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      {/* Cabeçalho: mês + setinhas */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center border hover:bg-slate-100"
        >
          ‹
        </button>
        <div className="font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center border hover:bg-slate-100"
        >
          ›
        </button>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {rows.map((week, i) => (
          <React.Fragment key={i}>
            {week.map((date) => {
              const isCurrentMonth = isSameMonth(date, monthStart);
              const isSelected =
                selected instanceof Date && isSameDay(date, selected);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleSelect(date)}
                  className={[
                    "w-9 h-9 rounded-full flex items-center justify-center mx-auto",
                    isSelected
                      ? "bg-black text-white"
                      : isCurrentMonth
                      ? "text-slate-900 hover:bg-slate-100"
                      : "text-slate-300",
                  ].join(" ")}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

