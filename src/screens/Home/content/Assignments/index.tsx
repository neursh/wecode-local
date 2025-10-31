import { useHookstate } from '@hookstate/core';
import { motion } from 'motion/react';
import { HomeContext } from '../../context';
import DisplayAssignments from './DisplayAssignments';
import Greet from './Greet';

export default function Assignments() {
  const selectedAssignment = useHookstate(HomeContext.selectedAssignment);
  const selectedProblem = useHookstate(HomeContext.selectedProblem);

  return (
    <motion.section
      className="absolute top-4 bottom-4 overflow-scroll p-8 outline outline-[white]/40 rounded-2xl"
      initial={{
        width: 'calc(100% - 32px)',
        opacity: 1,
        translateX: 'calc(0% - 0px)',
      }}
      animate={{
        width:
          selectedAssignment.value !== ''
            ? 'calc(55% - 40px)'
            : 'calc(100% - 32px)',
        opacity: selectedAssignment.value !== '' ? 0.75 : 1,
        translateX:
          selectedProblem.value === ''
            ? 'calc(0% - 0px)'
            : 'calc(-100% - 32px)',
      }}
      transition={{ ease: [0.25, 0.25, 0.15, 1] }}
    >
      <Greet />
      <DisplayAssignments />
    </motion.section>
  );
}
