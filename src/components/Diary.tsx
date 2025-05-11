import { useState } from "react";

type DiaryEntries = {
  [key: string]: string[];
};

export default function Diary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<DiaryEntries>({});

  const dateKey = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

  const handleDateChange = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleEntryChange = (yearIndex: number, text: string) => {
    setEntries((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || Array(5).fill("")).map((entry, i) =>
        i === yearIndex ? text : entry
      ),
    }));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => handleDateChange(-1)}>← Previous</button>
        <h2 style={{ display: "inline-block", margin: "0 20px" }}>
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </h2>
        <button onClick={() => handleDateChange(1)}>Next →</button>
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
