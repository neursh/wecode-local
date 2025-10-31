import { useHookstate } from '@hookstate/core';
import { motion } from 'motion/react';
import { useLayoutEffect } from 'react';
import { HomeContext, ProblemStatus } from '../../context';
import CountdownTimer from '../CountdownTimer';

export default function Problems() {
  const selectedAssignment = useHookstate(HomeContext.selectedAssignment);
  const assignments = useHookstate(HomeContext.assignments);
  const selectedProblem = useHookstate(HomeContext.selectedProblem);
  const problems = useHookstate(HomeContext.problems);

  const showUp = useHookstate(false);

  useLayoutEffect(() => {
    if (selectedAssignment.value !== '') {
      HomeContext.parseProblems();
    }
  }, [selectedAssignment]);

  return (
    <motion.section
      className="absolute w-[calc(45%-8px)] right-4 top-4 bottom-4 backdrop-blur-2xl overflow-scroll outline outline-[white]/40 rounded-2xl"
      initial={{ translateX: 'calc(100% + 18px)' }}
      animate={{
        translateX:
          selectedAssignment.value === ''
            ? 'calc(100% + 18px)'
            : 'calc(0% + 0px)',
        height:
          selectedProblem.value === ''
            ? 'calc(100% - 32px)'
            : 'calc(50% - 0px)',
        translateY:
          selectedProblem.value === ''
            ? 'calc(0% - 0px)'
            : !showUp.value
            ? 'calc(200% - 92px)'
            : 'calc(100% - 33px)',
        width:
          selectedProblem.value === '' ? 'calc(45% - 8px)' : 'calc(25% - 8px)',
      }}
      transition={{
        ease: [0.25, 0.25, 0.15, 1],
        translateY: {
          type: 'spring',
          duration: 0.75,
        },
        width: {
          duration: 0.25,
          ease: [0.25, 0.25, 0.15, 1],
        },
      }}
    >
      <motion.div
        className="sticky top-0 backdrop-blur-2xl flex flex-col p-8 outline outline-[white]/40 rounded-2xl z-10"
        initial={{ padding: '2rem' }}
        animate={{ padding: selectedProblem.value !== '' ? '1rem' : '2rem' }}
        onClick={() => {
          if (selectedProblem.value) {
            showUp.set((p) => !p);
          }
        }}
      >
        <div className="flex justify-between gap-2 cursor-pointer">
          <h1 className="text-xl font-bold text-nowrap overflow-hidden text-ellipsis">
            {assignments[selectedAssignment.value].value?.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            <CountdownTimer
              endDate={
                assignments[selectedAssignment.value].value?.endDate ??
                new Date()
              }
            />
          </div>
        </div>
        {selectedProblem.value !== '' ? (
          <p className="text-nowrap overflow-hidden text-ellipsis">
            Problem:{' '}
            {
              problems[selectedAssignment.value][selectedProblem.value].value
                .name
            }
          </p>
        ) : (
          <div className="flex gap-2 pt-2">
            <span className="badge badge-primary">Sort by status</span>
            <span className="badge badge-secondary">Refresh</span>
          </div>
        )}
      </motion.div>

      {problems[selectedAssignment.value].value ? (
        <motion.div
          className="flex flex-col gap-4 pt-6"
          initial={{ padding: '2rem' }}
          animate={{ padding: selectedProblem.value !== '' ? '1rem' : '2rem' }}
        >
          {Object.entries(problems[selectedAssignment.value].value).map(
            (value) => (
              <div
                key={`prob${value[0]}`}
                className={`card cursor-pointer outline outline-[white]/80 ${
                  value[1].status === ProblemStatus.solved
                    ? 'outline-green-300 outline-2'
                    : value[1].status === ProblemStatus.failed &&
                      'outline-red-300 outline-2'
                } ${selectedProblem.value === value[0] && 'outline-4'}`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (selectedProblem.value !== value[0]) {
                    selectedProblem.set(value[0]);
                  } else {
                    showUp.set(false);
                    selectedProblem.set('');
                  }
                }}
              >
                <div
                  className="card-body flex flex-row justify-between"
                  style={{
                    padding: selectedProblem.value !== '' ? '1rem' : '1.5rem',
                  }}
                >
                  <span className="text-lg font-bold">{value[1].name}</span>
                  <span
                    className={`badge ${
                      value[1].status === ProblemStatus.solved
                        ? 'badge-success'
                        : value[1].status === ProblemStatus.failed
                        ? 'badge-error'
                        : 'badge-dash'
                    }`}
                  >
                    {value[1].status !== ProblemStatus.noSubmission && '+'}
                    {value[1].status !== ProblemStatus.failed
                      ? value[1].score
                      : '0'}
                  </span>
                </div>
              </div>
            )
          )}
        </motion.div>
      ) : (
        <div className="flex justify-center items-center pt-12">
          <span className="loading loading-spinner"></span>
        </div>
      )}
    </motion.section>
  );
}
