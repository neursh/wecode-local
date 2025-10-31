import { useCallback, useLayoutEffect, useRef } from 'react';

export default function CountdownTimer(props: { endDate: Date }) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef(1);

  const updateCountdown = useCallback(() => {
    const distance = props.endDate.getTime() - new Date().getTime();

    if (distance < 0) {
      if (displayRef.current) {
        displayRef.current.innerHTML = 'Finished';
      }
      clearInterval(intervalRef.current);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formatted = `${days} day${days !== 1 ? 's' : ''}, ${String(
      hours
    ).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')} left`;

    if (displayRef.current) {
      displayRef.current.innerHTML = formatted;
    }
  }, [props.endDate]);

  useLayoutEffect(() => {
    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [updateCountdown]);

  return (
    <span
      ref={displayRef}
      className="badge badge-error font-bold text-nowrap text-ellipsis"
    />
  );
}
