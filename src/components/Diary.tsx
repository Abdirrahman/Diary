import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  getYear,
  parse,
} from "date-fns";

type DiaryEntries = {
  [key: string]: string[];
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Diary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<DiaryEntries>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("day");

  const dateKey = format(currentDate, "MM/dd");

  const handleDateChange = (days: number) => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + days)));
  };

  const handleEntryChange = (yearIndex: number, text: string) => {
    setEntries((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || Array(5).fill("")).map((entry, i) =>
        i === yearIndex ? text : entry
      ),
    }));
  };

  const selectDate = (date: Date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
    setViewMode("day");
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get array of dates for the calendar grid (including previous/next month dates)
    const startDay = startOfMonth(monthStart);
    const endDay = endOfMonth(monthEnd);
    const allDates = eachDayOfInterval({ start: startDay, end: endDay });

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
          marginTop: "10px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ textAlign: "center", fontWeight: "bold" }}>
            {day}
          </div>
        ))}
        {allDates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => selectDate(date)}
            style={{
              padding: "8px",
              background: isSameDay(date, currentDate) ? "#e0e0ff" : "white",
              color: isSameMonth(date, currentDate) ? "black" : "#666",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {format(date, "d")}
          </button>
        ))}
      </div>
    );
  };

  const renderYearSelection = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - 1999 },
      (_, i) => 2000 + i
    );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "5px",
          maxHeight: "300px",
          overflowY: "auto",
          marginTop: "10px",
        }}
      >
        {years.reverse().map((year) => (
          <button
            key={year}
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(year);
              setCurrentDate(newDate);
              setViewMode("month");
            }}
            style={{
              padding: "8px",
              background: getYear(currentDate) === year ? "#e0e0ff" : "white",
              border: "1px solid #ddd",
            }}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  const renderMonthSelection = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "5px",
        marginTop: "10px",
      }}
    >
      {months.map((month, index) => (
        <button
          key={month}
          onClick={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(index);
            setCurrentDate(newDate);
            setViewMode("day");
          }}
          style={{
            padding: "8px",
            background: currentDate.getMonth() === index ? "#e0e0ff" : "white",
            border: "1px solid #ddd",
          }}
        >
          {month}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <button onClick={() => handleDateChange(-1)}>← Previous</button>
        <h2
          style={{
            display: "inline-block",
            margin: "0 20px",
            cursor: "pointer",
            textDecoration: "underline",
            minWidth: "200px",
          }}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {format(currentDate, "MMMM do, yyyy")}
        </h2>
        <button onClick={() => handleDateChange(1)}>Next →</button>

        {showDatePicker && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              zIndex: 100,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              width: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                ←
              </button>
              <div>
                <button
                  onClick={() => setViewMode("month")}
                  style={{ margin: "0 10px", fontWeight: "bold" }}
                >
                  {format(currentDate, "MMMM")}
                </button>
                <button
                  onClick={() => setViewMode("year")}
                  style={{ margin: "0 10px", fontWeight: "bold" }}
                >
                  {format(currentDate, "yyyy")}
                </button>
              </div>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                →
              </button>
            </div>

            {viewMode === "day" && renderCalendarGrid()}
            {viewMode === "month" && renderMonthSelection()}
            {viewMode === "year" && renderYearSelection()}
          </div>
        )}
      </div>

      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Year {new Date().getFullYear() - 4 + i}:
          </label>
          <textarea
            value={entries[dateKey]?.[i] || ""}
            onChange={(e) => handleEntryChange(i, e.target.value)}
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "8px",
              fontSize: "16px",
            }}
          />
        </div>
      ))}
    </div>
  );
}
