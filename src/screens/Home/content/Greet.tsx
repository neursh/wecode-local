import { useMemo } from 'react';
import { GlobalContext } from '../../../context';

export default function Greet() {
  const greets = useMemo(
    () => [
      'Good day init?',
      'Good what ever time it is!',
      'Welcome!',
      'Back for more?',
      'Welcome back!',
      'Wassup?',
      'Greetings!',
      'Hello there!',
      ':3', // Super rare
    ],
    []
  );
  const greetRandom = useMemo(
    () => greets[Math.floor(Math.random() * (greets.length - 1))],
    [greets]
  );

  return (
    <div className="w-full flex justify-between items-center pb-4">
      <p className="font-bold text-4xl">{greetRandom}</p>
      <div
        className="tooltip tooltip-left"
        data-tip="Change profile"
        onClick={() => GlobalContext.exitCurrentProfile()}
      >
        <button className="btn btn-ghost btn-circle">
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
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
