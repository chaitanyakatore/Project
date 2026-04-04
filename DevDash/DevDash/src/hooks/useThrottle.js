import { useRef, useCallback } from "react";

export function useThrottle(callback, delay) {
  // useRef is like a secret notebook that React doesn't erase between renders.
  // We use it to remember the exact timestamp of the last time the function ran.
  const lastCallTime = useRef(0);

  // useCallback memoizes this function so it isn't recreated unnecessarily.
  return useCallback(
    (...args) => {
      // Get the current time in milliseconds
      const currentTime = new Date().getTime();

      // Have we waited long enough since the last time this ran?
      if (currentTime - lastCallTime.current >= delay) {
        // Update our secret notebook with the new timestamp
        lastCallTime.current = currentTime;

        // Execute the function
        callback(...args);
      }
    },
    [callback, delay],
  );
}
