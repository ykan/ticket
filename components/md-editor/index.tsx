'use client'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { useTheme } from 'next-themes'

type MDEditorProps = {
  value: string
  onChange?: (value: string) => void
}

export function MDEditor({ value, onChange }: MDEditorProps) {
  const { theme } = useTheme()

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[markdown()]}
      theme={theme === 'dark' ? githubDark : githubLight}
      basicSetup={{
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
      }}
    />
  )
}
