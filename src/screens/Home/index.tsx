import DisplayAssignments from './content/DisplayAssignments';
import Greet from './content/Greet';

export default function Home() {
  return (
    <section className="w-full h-dvh">
      <section className="pl-12 pr-12 pt-12">
        <Greet />
        <DisplayAssignments />
      </section>
    </section>
  );
}
