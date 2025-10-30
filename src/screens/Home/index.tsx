import DisplayAssignments from './content/DisplayAssignments';
import Greet from './content/Greet';

export default function Home() {
  return (
    <section className="w-full h-dvh p-4">
      <section className="w-full h-full overflow-scroll p-8 outline outline-[white]/40 rounded-2xl">
        <Greet />
        <DisplayAssignments />
      </section>
    </section>
  );
}
