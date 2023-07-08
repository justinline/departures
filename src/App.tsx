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

const getVoice = () =>
  window.speechSynthesis
    .getVoices()
    .find((voice) => voice.name.startsWith("Google UK English Male"));

const handleAnnouncement = (names: string[], time: string) => {
  if (window.speechSynthesis.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  const voice = getVoice();

  if (!voice) return;

  const announceThis = new SpeechSynthesisUtterance(
    `The next train arriving at platform 1 is the, ${time} underground service calling at ${names.join(
      ", "
    )}`
  );

  announceThis.voice = voice;

  window.speechSynthesis.speak(announceThis);
};

// @ts-expect-error: Window stuff for development
window.announce = handleAnnouncement;

function App() {
  const [serverLastUpdate, setServerLastUpdate] = useState<Date>(new Date());
  const [motd, setMotd] = useState<string[]>([]);
  const [timeInLondon, setTimeInLondon] = useState<Date>(getLondonTime());
  const [announced, setAnnounced] = useState(false);

  const getData = () =>
    fetch("/api/motd")
      .then((res) => res.json())
      .then((data) => {
        setMotd(data.motd);
        setServerLastUpdate(new Date(data.lastUpdated));
      });

  useEffect(() => {
    getData();
  }, []);

  useInterval(() => {
    setTimeInLondon(getLondonTime());

    const isOnTheHour = timeInLondon.getMinutes() === 0;
    const oneMinutePast = timeInLondon.getMinutes() === 1;

    if (isOnTheHour) {
      handleAnnouncement(motd, londonTime.slice(0, 5));
      setAnnounced(true);
    }

    if (announced && oneMinutePast) {
      setAnnounced(false);
    }

    const fiveMinutesAgo = new Date().getTime() - 1000 * 60 * 5;

    if (serverLastUpdate.getTime() < fiveMinutesAgo) {
      getData();
    }
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
    if (stationsLength === 0) return "";
    if (index === 0) return "due";
    const waitingTime = (maxStations - stationsLength) * 5;

    const minutesSinceRender = Math.floor(
      (timeInLondon.getTime() - serverLastUpdate.getTime()) / 1000 / 60
    );

    const minutes = index * 5 - minutesSinceRender + waitingTime;

    return `${minutes} min`;
  };

  return (
    <div>
      <div className="time-font board">
        {motd && (
          <>
            <ul className="train-list">
              {motd.map((str, index) => (
                <li
                  key={str}
                  className={index === 0 ? "blink train-item " : "train-item "}
                >
                  <span>{index + 1}</span>
                  <span style={{ flex: "1" }}>{str}</span>
                  <span style={{ textAlign: "right" }}>
                    {getTrainTime(index)}
                  </span>
                </li>
              ))}
              {motd.length === 0 && (
                <>
                  <li className="train-item ">
                    <span>1</span>
                    <span style={{ flex: "1" }}>
                      Service finished for the day.
                    </span>
                  </li>
                  <li style={{ height: "1em" }} />
                  <li style={{ height: "1em" }} />
                  <li style={{ height: "1em" }} />
                </>
              )}
              <li>
                <Marquee delay={1}>
                  <p style={{ marginRight: "0.5em" }}>
                    Departures every 5 minutes. Check back for further updates.
                    Planned engineering this weekend. Created by{" "}
                    <a href="https://github.com/justinline/departures">
                      justinline
                    </a>
                    .
                  </p>
                </Marquee>
              </li>
            </ul>
            <div
              style={{
                fontWeight: 400,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div />
              <div>{londonTime}</div>
              <WakeLock />
            </div>
          </>
        )}
      </div>

      <div className="time-font orientation-warning">
        Best viewed in landscape
      </div>
    </div>
  );
}

export default App;
