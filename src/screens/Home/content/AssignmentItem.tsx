import { useLayoutEffect, useRef } from 'react';

export default function AssginmentItem(props: {
  name?: string;
  notes?: string;
  problems?: string;
  submissions?: string;
  author?: string;
  endDate?: Date;
}) {
  return (
    <div className="card outline outline-[white]/40">
      <div className="w-full card-body flex flex-col justify-between">
        <p className="font-bold text-lg">{props.name}</p>
        <div className="flex flex-wrap justify-end gap-2 pl-8 pt-4">
          {props.notes && (
            <span className="badge badge-info">{props.notes}</span>
          )}
          {props.problems && (
            <span
              className="badge badge-success flex items-center gap-1 tooltip"
              data-tip={`${props.submissions} submissions made`}
            >
              <span>
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>
              </span>
              {props.problems} Problems
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2 pl-8 pr-2">
          {props.endDate && <CountdownTimer endDate={props.endDate} />}
          {props.author && (
            <span className="flex items-center gap-0.5">
              <span>
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
              {props.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CountdownTimer(props: { endDate: Date }) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef(1);

  useLayoutEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = props.endDate.getTime() - now;

      if (distance < 0) {
        if (displayRef.current) {
          displayRef.current.innerHTML = "Time's up!";
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
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <span ref={displayRef} className="badge badge-error font-bold"></span>;
}
