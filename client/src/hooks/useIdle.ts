import { useEffect, useState, useCallback } from "react";

export function useIdle(timeoutMs: number): boolean {
  const [idle, setIdle] = useState(false);

  const reset = useCallback(() => setIdle(false), []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), timeoutMs);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    events.forEach((e) => window.addEventListener(e, startTimer as EventListener, { passive: true }));

    startTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
      events.forEach((e) => window.removeEventListener(e, startTimer as EventListener));
    };
  }, [timeoutMs, reset]);

  return idle;
}
