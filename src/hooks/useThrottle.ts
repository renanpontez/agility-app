function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastExecutionTime = 0;
  let timeout: NodeJS.Timeout | null = null;

  return function throttledFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remainingTime = delay - (now - lastExecutionTime);

    if (remainingTime <= 0 || remainingTime > delay) {
      // Clear any existing timeout
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      // Update the last execution time and call the function
      lastExecutionTime = now;
      func(...args);
    } else if (!timeout) {
      // Set a timeout to call the function after the remaining time
      timeout = setTimeout(() => {
        lastExecutionTime = Date.now();
        func(...args);
        timeout = null;
      }, remainingTime);
    }
  };
}

export default useThrottle;
