import React, { useState, useEffect, useRef } from "react";

const ITEM_HEIGHT = 40;

function InfiniteScrollColumn({ values, selected, onChange }) {
  const scrollRef = useRef(null);

  // lista triplicada para scroll infinito
  const looped = [...values, ...values, ...values];

  // índice inicial no bloco do meio
  const initialIndex = values.indexOf(selected) + values.length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = initialIndex * ITEM_HEIGHT;
    }
  }, [initialIndex]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const total = values.length * ITEM_HEIGHT;

    // Reposiciona ao rolar muito
    if (container.scrollTop < total * 0.4) {
      container.scrollTop += total;
    } else if (container.scrollTop > total * 1.6) {
      container.scrollTop -= total;
    }

    // Calcula selecionado
    const index = Math.round(container.scrollTop / ITEM_HEIGHT);
    const realValue = looped[index % looped.length];

    onChange(realValue);
  };

  return (
    <div className="relative w-20 h-40 overflow-hidden">
      {/* Barra removida */}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-y-scroll h-full text-center scrollbar-none"
      >
        {looped.map((item, index) => (
          <div
            key={index}
            className={`h-10 flex items-center justify-center text-lg ${
              item === selected ? "text-blue-600 font-bold" : "text-gray-400"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimePickerIOS({ value, onChange }) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value]);

  const updateHour = (h) => {
    setSelectedHour(h);
    onChange(`${h}:${selectedMinute}`);
  };

  const updateMinute = (m) => {
    setSelectedMinute(m);
    onChange(`${selectedHour}:${m}`);
  };

  return (
    <div className="flex justify-center items-center gap-8 py-4">
      <InfiniteScrollColumn
        values={hours}
        selected={selectedHour}
        onChange={updateHour}
      />

      <InfiniteScrollColumn
        values={minutes}
        selected={selectedMinute}
        onChange={updateMinute}
      />
    </div>
  );
}
