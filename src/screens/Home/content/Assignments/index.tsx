import { useHookstate } from '@hookstate/core';
import { motion } from 'motion/react';
import { HomeContext } from '../../context';
import DisplayAssignments from './DisplayAssignments';
import Greet from './Greet';

export default function Assignments() {
  const selectedAssignment = useHookstate(HomeContext.selectedAssignment);

  return (
    <motion.section
      className="w-1/2 h-full overflow-scroll p-8 outline outline-[white]/40 rounded-2xl"
      initial={{ width: '100%' }}
      animate={{ width: selectedAssignment.value !== '' ? '60%' : '100%' }}
      transition={{ ease: [0.25, 0.25, 0.15, 1] }}
    >
      <Greet />
      <DisplayAssignments />
    </motion.section>
  );
}
