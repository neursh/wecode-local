import { useMemo } from 'react';
import { GlobalContext } from '../../../context';

// This is a really important feature. This should only be edited by the owner. >:(
export default function Greet() {
  const greets = useMemo(
    () => [
      'Good day init?',
      'Good what ever time it is!',
      'Howdy!',
      'Ciao!',
      'Well, look who it is!',
      'Well, look who come crawling back!',
      'Xin chào!',
      'Welcome!',
      'Back for more?',
      'Welcome back!',
      'How’s it going?',
      'Grab me a snack!',
      'All roads lead to Rome.',
      'WeCode Premium',
      'ICode',
      'UCode',
      'MeCode',
      'Consider touching grass.',
      'Wassup?',
      'Greetings!',
      'Hello there!',
      '6 7',
      '/ᐠ_ ꞈ _ᐟ\\',
      '(⸝⸝⸝О﹏О⸝⸝⸝)',
    ],
    []
  );
  const greetRandom = useMemo(
    () => greets[Math.ceil(Math.random() * (greets.length - 1))],
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
