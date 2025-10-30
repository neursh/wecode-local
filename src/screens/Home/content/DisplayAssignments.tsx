import { State, useHookstate } from '@hookstate/core';
import { motion } from 'motion/react';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { Assignment, HomeContext } from '../context';

export default function DisplayAssignments() {
  const assignments = useHookstate(HomeContext.assignments);
  const refreshNotifier = useHookstate(true);
  const refreshing = useRef(false);

  useLayoutEffect(() => {
    if (refreshNotifier.value && !refreshing.current) {
      refreshing.current = true;
      HomeContext.parseAssignments().then(() => {
        refreshing.current = false;
        refreshNotifier.set(false);
      });
    }
  }, [refreshNotifier]);

  return (
    <section className="flex flex-col">
      <Refresh refreshNotifier={refreshNotifier} />
      <Ongoing assignments={assignments} />
      <Finished assignments={assignments} />
    </section>
  );
}

function Refresh(props: { refreshNotifier: State<boolean> }) {
  const checkIcon = useHookstate(false);
  const updateOn = useHookstate('');

  useLayoutEffect(() => {
    if (!props.refreshNotifier.value) {
      updateOn.set(new Date().toLocaleString('en-GB'));
      checkIcon.set(true);
      setTimeout(() => checkIcon.set(false), 1500);
    }
  }, [props.refreshNotifier.value]);

  useLayoutEffect(() => {
    const autoRefresh = setInterval(
      () => props.refreshNotifier.set(true),
      20000
    );

    return () => clearInterval(autoRefresh);
  }, []);

  return (
    <div className="flex justify-end sticky top-4 z-10">
      <div className="flex justify-end items-center gap-4 backdrop-blur-2xl pl-4 pr-1 pt-1 pb-1 outline outline-[white]/40 rounded-full">
        {updateOn.value !== '' && (
          <p className="text-sm">Updated on: {updateOn.value}</p>
        )}
        <button
          className={`btn btn-circle ${
            props.refreshNotifier.value && 'btn-disabled'
          }`}
          onClick={() =>
            !props.refreshNotifier.value &&
            !checkIcon.value &&
            props.refreshNotifier.set(true)
          }
        >
          <motion.svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            initial={{ rotate: 0 }}
            animate={{ rotate: props.refreshNotifier.value ? 360 : 0 }}
            transition={{
              duration: 0.5,
              repeat: props.refreshNotifier.value ? Infinity : 0,
            }}
          >
            <motion.path
              className="absolute"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              animate={{ opacity: checkIcon.value ? 0 : 1 }}
            />
            <motion.path
              className="absolute"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
              animate={{ opacity: checkIcon.value ? 1 : 0 }}
            />
          </motion.svg>
        </button>
      </div>
    </div>
  );
}

function Ongoing(props: { assignments: State<{ [key: string]: Assignment }> }) {
  return (
    <>
      <Title
        icon={
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
            />
          </svg>
        }
        title="Ongoing assignments"
      />
      <div className="pt-6 pb-6 grid grid-cols-2 gap-4">
        {Object.entries(props.assignments.value).map((value) => {
          if (value[1].notes.toLowerCase() !== 'finished') {
            return (
              <AssginmentItem
                key={`assign${value[0]}`}
                name={value[1].name}
                notes={value[1].notes}
                problems={value[1].problems}
                author={value[1].author}
                endDate={value[1].endDate}
              />
            );
          }
        })}
      </div>
    </>
  );
}

function Finished(props: {
  assignments: State<{ [key: string]: Assignment }>;
}) {
  return (
    <>
      <Title
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
            />
          </svg>
        }
        title="Finished assignments"
      />
      <div className="pt-6 pb-6 grid grid-cols-3 gap-4">
        {Object.entries(props.assignments.value).map((value) => {
          if (value[1].notes.toLowerCase() === 'finished') {
            return (
              <AssginmentItem
                key={`assign${value[0]}`}
                name={value[1].name}
                problems={value[1].problems}
                author={value[1].author}
              />
            );
          }
        })}
      </div>
    </>
  );
}

function Title(props: { icon: ReactNode; title: string }) {
  return (
    <p className="font-semibold text-xl flex gap-1">
      <span>{props.icon}</span>
      {props.title}
    </p>
  );
}

function AssginmentItem(props: {
  name?: string;
  notes?: string;
  problems?: string;
  author?: string;
  endDate?: Date;
}) {
  return (
    <div className="card outline outline-[white]/40">
      <div className="w-full card-body flex flex-col justify-between gap-4">
        <p className="font-bold text-lg">{props.name}</p>
        <div className="flex flex-wrap justify-end gap-2 pl-8">
          {props.endDate && <CountdownTimer endDate={props.endDate} />}
          {props.notes && (
            <span className="badge badge-info">{props.notes}</span>
          )}
          {props.problems && (
            <span className="badge badge-success flex items-center gap-1">
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
