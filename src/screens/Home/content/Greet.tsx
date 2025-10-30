import { useMemo } from 'react';

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
      ':3',
    ],
    []
  );
  const greetRandom = useMemo(
    () => greets[Math.floor(Math.random() * (greets.length - 1))],
    [greets]
  );

  return <p className="font-bold text-4xl pb-4">{greetRandom}</p>;
}
