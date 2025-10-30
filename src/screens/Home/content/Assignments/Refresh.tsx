import { State, useHookstate } from "@hookstate/core";
import { motion } from "motion/react";
import { useLayoutEffect } from "react";

export default function Refresh(props: { refreshNotifier: State<boolean> }) {
  const checkIcon = useHookstate(false);
  const updateOn = useHookstate('');

  useLayoutEffect(() => {
    if (!props.refreshNotifier.value) {
      updateOn.set(new Date().toLocaleString('en-GB'));
      checkIcon.set(true);
      setTimeout(() => checkIcon.set(false), 1500);
    }
  }, [props.refreshNotifier.value]);

  useLayoutEffect(() => {
    const autoRefresh = setInterval(
      () => props.refreshNotifier.set(true),
      20000
    );

    return () => clearInterval(autoRefresh);
  }, []);

  return (
    <div className="flex justify-end sticky -top-2 z-10">
      <div className="flex justify-end items-center gap-4 backdrop-blur-2xl pl-4 pr-1 pt-1 pb-1 outline outline-[white]/40 rounded-full">
        {updateOn.value !== '' && (
          <p className="text-sm">Updated on: {updateOn.value}</p>
        )}
        <button
          className={`btn btn-circle ${
            props.refreshNotifier.value && 'btn-disabled'
          }`}
          onClick={() =>
            !props.refreshNotifier.value &&
            !checkIcon.value &&
            props.refreshNotifier.set(true)
          }
        >
          <motion.svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            initial={{ rotate: 0 }}
            animate={{ rotate: props.refreshNotifier.value ? 360 : 0 }}
            transition={{
              duration: 0.5,
              repeat: props.refreshNotifier.value ? Infinity : 0,
            }}
          >
            <motion.path
              className="absolute"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              animate={{ opacity: checkIcon.value ? 0 : 1 }}
            />
            <motion.path
              className="absolute"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
              animate={{ opacity: checkIcon.value ? 1 : 0 }}
            />
          </motion.svg>
        </button>
      </div>
    </div>
  );
}
