import useWakeLock from "./useWakeLock";
import "./WakeLock.css";

const WakeLock = () => {
  const { isSupported, released, request, release } = useWakeLock({});

  console.log(`Screen Wake Lock API supported: ${isSupported}`);

  return (
    <div className="WakeLock">
      <p className="time-font">Wake Lock</p>
      <button
        style={{ height: "2rem", width: "2rem" }}
        type="button"
        onClick={() => (released === false ? release() : request())}
      >
        {released === false ? (
          <img src="/wake-on.svg" alt="Release" className="WakeIcon" />
        ) : (
          <img src="/wake-off.svg" alt="Request" className="WakeIcon" />
        )}
      </button>
    </div>
  );
};

export default WakeLock;
