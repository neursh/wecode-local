import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useCallback } from 'react';

export default function Code() {
  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editor.updateOptions({
        readOnly: true,
        readOnlyMessage: {
          value: "You can't edit template, silly!",
          isTrusted: true,
        },
      });

      editor.setValue(
        '#include <iostream>\n#include <iostream>\n#include <iostream>\n#include <iostream>\n'
      );
    },
    []
  );

  return (
    <>
      <div className="w-[50vw] h-[50vh]">
        <Editor
          onMount={handleEditorDidMount}
          width="100%"
          height="100%"
          defaultLanguage="cpp"
          loading={<span className="loading loading-spinner loading-xs"></span>}
        />
      </div>
      <div className="w-[50vw] h-[50vh]">
        <Editor
          onMount={handleEditorDidMount}
          width="100%"
          height="100%"
          defaultLanguage="cpp"
          loading={<span className="loading loading-spinner loading-xs"></span>}
        />
      </div>
    </>
  );
}
