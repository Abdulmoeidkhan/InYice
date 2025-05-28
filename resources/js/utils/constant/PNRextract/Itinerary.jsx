import React, { useState } from 'react';
import  {airline}  from '../PNRdata/airlinedata.js';
import { airports } from '../PNRdata/airportdata.js';

// ✅ Combined parser for Galileo & Sabre
const parsePNRLine = (line) => {
  // Galileo format
  const galileoRegex = /^\s*(\d+)\s*\.\s*(\w{2})\s+(\d+)\s+(\w)\s+(\d{2}[A-Z]{3})\s+([A-Z]{3})([A-Z]{3})\s+(\w+)\s+(\d{4})\s+(\d{4})\s+(\w)\s+.*?(\w{2})(?:\s+(\d+))?/;
  const galileoMatch = line.match(galileoRegex);

  if (galileoMatch) {
    const [
      _,
      lineNumber,
      airlineCode,
      flightNumber,
      bookingClass,
      date,
      origin,
      destination,
      bookingStatus,
      departureTime,
      arrivalTime,
      aircraftStatus,
      dayOfWeek,
      stopCount = '0'
    ] = galileoMatch;

    return {
      format: "Galileo",
      lineNumber: parseInt(lineNumber),
      airlineCode,
      flightNumber,
      bookingClass,
      date,
      origin,
      destination,
      bookingStatus,
      departureTime,
      arrivalTime,
      aircraftStatus,
      dayOfWeek,
      stopCount: parseInt(stopCount)
    };
  }

  // Sabre format
  const sabreRegex = /^\s*(\d+)\s+(\w{2})\s+(\d+)([A-Z])\s+(\d{2}[A-Z]{3})\s+(\d)\s+([A-Z]{3})([A-Z]{3})\*([A-Z]{2}\d+)\s+(\d{4})\s+(\d{4})/;
  const sabreMatch = line.match(sabreRegex);

  if (sabreMatch) {
    const [
      _,
      lineNumber,
      airlineCode,
      flightNumber,
      bookingClass,
      date,
      dayOfWeek,
      origin,
      destination,
      bookingStatus,
      departureTime,
      arrivalTime
    ] = sabreMatch;

    return {
      format: "Sabre",
      lineNumber: parseInt(lineNumber),
      airlineCode,
      flightNumber,
      bookingClass,
      date,
      dayOfWeek,
      origin,
      destination,
      bookingStatus,
      departureTime,
      arrivalTime
    };
  }

  return null; 
};

const Itinerary = () => {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState([]);

  const handleParse = () => {
    const lines = input.trim().split('\n');
    const parsed = lines.map(parsePNRLine).filter(Boolean);
    setParsedData(parsed);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>PNR Itinerary Parser</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="Paste itinerary here..."
      />
      <button onClick={handleParse}>Parse Itinerary</button>

      <h3>Parsed Output</h3>
        {/* {parsedData.length > 0 ? (
        parsedData.map((flight, index) => (
        // console.log(flight)
        <pre
            key={index}
            style={{
              background: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
              color: 'black'
            }}
          >
            {JSON.stringify(flight, null, 2)}
          </pre>
        ))
      ) : (
        <p>No data parsed yet.</p>
      )} */}
{/* 
{parsedData.length > 0 && parsedData.map((flight, index) => {
  const airlineCode = flight.airlineCode; 
  console.log(airlineCode)
  const matchedAirline = airline.find(a => a.iata === airlineCode);
  console.log(matchedAirline)
  const flightWithAirlineName = {
    ...flight,
    airlineName: matchedAirline ? matchedAirline.name : 'Unknown Airline'
  };

  return (
    <div
      key={index}
      style={{

        background: '#f4f4f4',
        padding: '10px',
        borderRadius: '5px',
        color: 'black',
        marginBottom: '10px'
      }}
    >
      <p><strong>Airline Code:</strong> {airlineCode}</p>
      <p><strong>Airline Name:</strong> {matchedAirline ? matchedAirline.name : 'Unknown Airline'}</p>
      <p><strong>Destination:</strong> {flight.destination}</p>

            <pre>      {JSON.stringify(flightWithAirlineName, null, 2)}
</pre>

    </div>
  );
})} */}

{parsedData.length > 0 && parsedData.map((flight, index) => {
  const airlineCode = flight.airlineCode;
  const destinationCode = flight.destination;
  const originCode = flight.origin;

  // Match using object key directly
  const matchedAirline = airline[airlineCode];
  const matchedDestination = airports[destinationCode];
  const matchedOrigin = airports[originCode];

  const flightWithNames = {
    ...flight,
    airlineName: matchedAirline ? matchedAirline.airlineName : 'Unknown Airline',
    destinationName: matchedDestination ? matchedDestination.name : 'Unknown Airport',
    originName: matchedOrigin ? matchedOrigin.name : 'Unknown Airport',
  };

  const logoUrl = `https://www.pnrconverter.com/images/airlines/png/150/${airlineCode.toLowerCase()}.png`;

  return (
    <div
      key={index}
      style={{
        background: '#f4f4f4',
        padding: '10px',
        borderRadius: '5px',
        color: 'black',
        marginBottom: '10px',
        maxWidth: '600px',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        wordBreak: 'break-word'
      }}
    >
      <img
        src={logoUrl}
        alt={`${flightWithNames.airlineName} Logo`}
        style={{ width: '80px', marginBottom: '10px' }}
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      <p><strong>Airline Code:</strong> {airlineCode}</p>
      <p><strong>Airline Name:</strong> {flightWithNames.airlineName}</p>

      <p><strong>Origin Code:</strong> {originCode}</p>
      <p><strong>Origin Name:</strong> {flightWithNames.originName}</p>

      <p><strong>Destination Code:</strong> {destinationCode}</p>
      <p><strong>Destination Name:</strong> {flightWithNames.destinationName}</p>

      <pre style={{
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '0.85rem',
        overflowX: 'auto',
        maxHeight: '200px',
        whiteSpace: 'pre-wrap'
      }}>
        {JSON.stringify(flightWithNames, null, 2)}
      </pre>
    </div>
  );
})}


    </div>
  );
};

export default Itinerary;
