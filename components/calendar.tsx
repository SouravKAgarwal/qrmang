"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Calendar } from "./ui/calendar";

const CalendarPop = () => {
  const [date, setDate] = useState<Date>();
  return (
    <Card>
      <div className="p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </Card>
  );
};

export default CalendarPop;
