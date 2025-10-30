import { State, useHookstate } from '@hookstate/core';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { Assignment, HomeContext } from '../context';
import AssginmentItem from './AssignmentItem';
import Refresh from './Refresh';

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
                submissions={value[1].submissions}
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
                submissions={value[1].submissions}
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
