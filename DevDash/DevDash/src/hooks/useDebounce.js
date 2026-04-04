// Line 1: We need to remember a value (useState) and perform a side effect like a timer (useEffect)
import { useState, useEffect } from "react";

// Line 2: We create a function that takes the user's text (value) and how long to wait (delay)
export function useDebounce(value, delay) {
  // Line 3: We create a piece of state to hold the "delayed" version of the text
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Line 4: This effect runs every single time the user types a letter
  useEffect(() => {
    // Line 5: We start a countdown timer.
    // It says: "Wait [delay] milliseconds, then update the delayed text."
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Line 6: THE CLEANUP FUNCTION (Crucial!)
    // If the user types another letter BEFORE the timer finishes, React runs this cleanup.
    // It destroys the old timer so it doesn't trigger, and starts a brand new one.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Line 7: Re-run this effect if the text or delay changes

  // Line 8: Finally, we give the delayed text back to the app
  return debouncedValue;
}
