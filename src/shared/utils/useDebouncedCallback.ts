import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a stable debounced version of `callback` that fires only after
 * `delay` ms of inactivity, plus a `cancel` function to discard any pending
 * call before it fires.
 *
 * Design notes:
 * - The latest `callback` is always used via a ref so callers never observe
 *   stale closures, without restarting the debounce timer on every render.
 * - `call` and `cancel` are referentially stable (useCallback with no
 *   runtime-changing deps), safe to pass as effect deps or memoized prop.
 * - The pending timer is automatically cancelled on unmount to prevent
 *   state updates on an unmounted tree.
 *
 * @example
 * const { call: debouncedSave, cancel } = useDebouncedCallback(save, 400);
 *
 * // In an event handler:
 * debouncedSave(value);       // schedules save(value) in 400 ms
 *
 * // To discard a pending call (e.g. on external reset):
 * cancel();
 */
export function useDebouncedCallback<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number
): { call: (...args: A) => void; cancel: () => void } {
  // Keep callback ref up-to-date on every render so we always invoke the
  // latest closure without restarting the debounce timer.
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cancel automatically on unmount.
  useEffect(() => () => cancel(), [cancel]);

  const call = useCallback(
    (...args: A) => {
      cancel();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        callbackRef.current(...args);
      }, delay);
    },
    [cancel, delay]
  );

  return { call, cancel };
}
