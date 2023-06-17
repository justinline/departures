import { useEffect, useState } from "react";
import "./App.css";
import "unfonts.css";
import useInterval from "./useInterval";
import Marquee from "react-fast-marquee";
import WakeLock from "./WakeLock";

const getLondonTime = () => {
  const date = new Date();

  return date;
};

function App() {
  const [renderDate] = useState<Date>(new Date());
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
  }, 1000);

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

    const minutesSinceRender = Math.floor(
      (timeInLondon.getTime() - renderDate.getTime()) / 1000 / 60
    );

    const minutes = index * 5 - minutesSinceRender + waitingTime;

    return `${minutes} min`;
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          background: "black",
          padding: "0.5em 2em",
          borderRadius: "4px",
        }}
        className="time-font board"
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
              <li>
                <Marquee delay={1}>
                  <p style={{ marginRight: "0.5em" }}>
                    Departures every 5 minutes. Check back for further updates.
                    Planned engineering this weekend. Created by{" "}
                    <a href="https://github.com/justinline">justinline</a>.
                  </p>
                </Marquee>
              </li>
            </ul>
            <div style={{ fontWeight: 400 }}>{londonTime}</div>
          </>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <WakeLock />
      </div>
    </div>
  );
}

export default App;
