import { useHookstate } from '@hookstate/core';
import { motion } from 'motion/react';
import { useLayoutEffect } from 'react';
import { HomeContext } from '../../context';

export default function Problems() {
  const problemsCache = useHookstate(HomeContext.problemsCache);
  const selectedAssignment = useHookstate(HomeContext.selectedAssignment);
  const assignments = useHookstate(HomeContext.assignments);

  useLayoutEffect(() => {
    if (selectedAssignment.value !== '') {
      HomeContext.parseProblems();
    }
  }, [selectedAssignment]);

  return (
    <motion.section
      className="absolute w-[calc(40%-8px)] right-4 top-4 bottom-4 overflow-scroll p-8 outline outline-[white]/40 rounded-2xl"
      initial={{ translateX: 'calc(100% + 18px)' }}
      animate={{
        translateX:
          selectedAssignment.value !== ''
            ? 'calc(0% + 0px)'
            : 'calc(100% + 18px)',
      }}
      transition={{
        ease: [0.25, 0.25, 0.15, 1],
      }}
    >
      <h1 className="text-2xl font-bold pb-4">
        {selectedAssignment.value !== '' &&
          assignments[selectedAssignment.value].value.name}
      </h1>
      {Object.keys(problemsCache.value).length !== 0 ? (
        <>
          {Object.entries(problemsCache.value).map((value) => (
            <div key={`prob${value[0]}`}>{value[1].name}</div>
          ))}
        </>
      ) : (
        <div className="h-full flex justify-center items-center">
          <span className="loading loading-spinner"></span>
        </div>
      )}
    </motion.section>
  );
}
