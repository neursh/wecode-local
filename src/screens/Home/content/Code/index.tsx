import { useHookstate } from '@hookstate/core';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { motion } from 'motion/react';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { HomeContext } from '../../context';

export default function Code() {
  const selectedAssignment = useHookstate(HomeContext.selectedAssignment);
  const selectedProblem = useHookstate(HomeContext.selectedProblem);
  const problems = useHookstate(HomeContext.problems);

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      // editor.updateOptions({
      //   readOnly: true,
      //   readOnlyMessage: {
      //     value: "You can't edit the template, silly!",
      //     isTrusted: true,
      //   },
      // });
      // editor.setValue(
      //   '#include <iostream>\n#include <iostream>\n#include <iostream>\n#include <iostream>\n'
      // );
    },
    []
  );

  const description = useRef<HTMLIFrameElement>(null);

  useLayoutEffect(() => {
    HomeContext.parseProblemDescription().then(
      () =>
        (description.current!.srcdoc =
          problems[selectedAssignment.value][selectedProblem.value]?.value
            ?.description ?? '')
    );
  }, [selectedProblem.value]);

  return (
    <motion.section
      className="absolute left-4 top-4 bottom-4 right-4 outline outline-[black]/50 overflow-clip rounded-2xl flex"
      initial={{ translateX: 'calc(-100% - 18px)' }}
      animate={{
        translateX:
          selectedProblem.value !== ''
            ? 'calc(0% - 0px)'
            : 'calc(-100% - 18px)',
      }}
      transition={{
        ease: [0.25, 0.25, 0.15, 1],
        duration: selectedProblem.value !== '' ? 0.5 : 0.25,
      }}
    >
      <Editor
        theme="vs-dark"
        onMount={handleEditorDidMount}
        width="50%"
        height="100%"
        defaultLanguage="cpp"
        loading={<span className="loading loading-spinner loading-xs"></span>}
      />
      <div className="w-[50%] h-full">
        <iframe className="w-full h-full invert" ref={description}></iframe>
      </div>
    </motion.section>
  );
}
