import React from "react";

const useInterval = (callback: () => void, delay = 1000) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedCallback = React.useRef(() => {});

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, []);
};

export default useInterval;
