
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

const BREAK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const useBreak = () => {
  const [isOnBreak, setIsOnBreak] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestBreak = useCallback(() => {
    if (isOnBreak) {
      toast.info("You're already on a break! Hang tight.");
      return;
    }

    setIsOnBreak(true);
    const startTime = Date.now();

    toast.success("Relief Pitcher is in! Take a 5-minute break.", {
      duration: 10000
    });

    // Show countdown updates at 1 min intervals
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.ceil((BREAK_DURATION_MS - elapsed) / 60000);
      if (remaining > 0 && remaining < 5) {
        toast.info(`${remaining} minute${remaining > 1 ? 's' : ''} left on your break.`, {
          duration: 4000
        });
      }
    }, 60000);

    // End the break
    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsOnBreak(false);
      toast.success("Break's over — back to the game! Let's go!", {
        duration: 8000
      });
    }, BREAK_DURATION_MS);
  }, [isOnBreak]);

  return { requestBreak, isOnBreak };
};
