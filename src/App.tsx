import { useEffect, useState } from "react";
import "./App.css";
import "unfonts.css";
import useInterval from "./useInterval";

const getLondonTime = () => {
  const date = new Date();

  return date;
};

function App() {
  const [motd, setMotd] = useState<string[]>([]);
  const [timeInLondon, setTimeInLondon] = useState<Date>(getLondonTime());

  useEffect(() => {
    fetch("/api/motd")
      .then((res) => res.json())
      .then((data) => setMotd(data.motd));

    const fiveMinutes = 1000 * 60 * 5;

    setTimeout(() => {
      window.location.reload();
    }, fiveMinutes);
  }, []);

  useInterval(() => {
    setTimeInLondon(getLondonTime());
  });

  const londonTime = timeInLondon.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/London",
  });

  const stationsLength = motd.length;
  const maxStations = 4;
  // If 4 stations, index 0 would be 0 minutes, index 1 would be 5 minutes
  // If 3 stations, index 0 would be 5 minutes, index 1 would be 10 minutes
  const getTrainTime = (index: number) => {
    if (index === 0) return "due";
    const waitingTime = (maxStations - stationsLength) * 5;
    const minutes = index * 5 + waitingTime;

    return `${minutes} min`;
  };

  return (
    <div
      style={{ background: "#393939", padding: "3rem", borderRadius: "4px" }}
    >
      <div
        style={{
          background: "black",
          color: "orange",
          padding: "0.5rem 2rem",
          fontSize: "2rem",
          borderRadius: "4px",
          minWidth: "800px",
        }}
      >
        {motd && (
          <>
            <ul
              style={{
                listStyle: "none",
                paddingLeft: "0",
                textAlign: "left",
              }}
            >
              {motd.map((str, index) => (
                <li
                  key={str}
                  className={index === 0 ? "blink" : ""}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2rem 2fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <span>{index + 1}</span>
                  <span style={{ flex: "1" }}>{str}</span>
                  <span style={{ textAlign: "right" }}>
                    {getTrainTime(index)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="time-font">{londonTime}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
