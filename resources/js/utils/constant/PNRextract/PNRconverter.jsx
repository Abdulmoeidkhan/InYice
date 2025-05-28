import React, { useState } from "react";

const PNRconverter = () => {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState(null);

 const handleParse = () => {
  const lines = input.trim().split(/\r?\n|\r/);
  const firstLine = lines[0] || "";

  const bookingRef = firstLine.split("/")[0]?.trim() || "N/A";
  const bookingDateMatch = firstLine.match(/\b\d{2}[A-Z]{3}\b/);
  const bookingDate = bookingDateMatch ? bookingDateMatch[0] : "N/A";

  const allText = lines.join(" ");

const passengerRegex = /\d+\.\d+([A-Z\s]+)\/([A-Z\s]+)\s+(MSTR|MISS|MRS|MR|MS)(\*\S*)?/g;

  let match;
  const passengers = [];

  while ((match = passengerRegex.exec(allText)) !== null) {
    const lastName = capitalize(match[1].trim());
    const firstName = capitalize(match[2].trim());
    const title = match[3]; // Keep as is

    console.log("Title:", title, "| FirstName:", firstName, "| LastName:", lastName);
    console.log("Raw match:", match[0]);  // poora match string
console.log("Title:", match[3]);

    passengers.push(`${title} ${firstName} ${lastName}`);
  }

  const infRegex = /\d+\.I\/\d+([A-Z]+)\/([A-Z\s]+)\s+INF\*\d{2}[A-Z]{3}\d{2}/g;
  while ((match = infRegex.exec(allText)) !== null) {
    const lastName = capitalize(match[1].trim());
    const firstName = capitalize(match[2].trim());
    passengers.push(`INF ${firstName} ${lastName}`);
  }

  setParsed({ bookingRef, bookingDate, passengers });
};


  const capitalize = (str) =>
    str
      .split(" ")
      .map((word) => word[0] + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <textarea
        className="w-full h-60 border p-2 rounded"
        placeholder="Paste PNR raw data here..."
        value={input}
        rows={8}
        style={{ width: "100%", marginBottom: "10px" }}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleParse}
      >
        Parse
      </button>

      {parsed && (
        <div className="mt-4 space-y-2">
          <p>
            <strong>Booking Ref:</strong> {parsed.bookingRef}
          </p>
          <p>
            <strong>Booking Date:</strong> {parsed.bookingDate}
          </p>
          <p>
            <strong>Passengers:</strong>
          </p>
          <ul className="list-disc pl-6">
            {parsed.passengers.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PNRconverter;
