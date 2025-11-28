/**
 * Allows to trigger a future callback
 
 * @param timeoutRef    timer reference
 * @param callback      callback action
 * @param time          amount of time to wait
 */
export const loadTimer = (
  timeoutRef: React.MutableRefObject<any>,
  callback: any,
  time: number
) => {
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => {
    callback();
  }, time);
};

/**
 * Creates a delay by returning a promise that resolves after the specified time.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
