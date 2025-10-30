import Assignments from './content/Assignments';
import Problems from './content/Problems';

export default function Home() {
  return (
    <section className="relative min-w-full max-w-full min-h-dvh max-h-dvh p-4 overflow-x-hidden">
      <Assignments />
      <Problems />
    </section>
  );
}
