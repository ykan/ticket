'use client'
import * as React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { useTheme } from 'next-themes'
import { upload } from '@vercel/blob/client'
import { Button } from '@/components/ui/button'
import { ImageIcon, Loader2 } from 'lucide-react'
import { EditorView } from '@codemirror/view'
import { cn } from '@/lib/utils'

type MDEditorProps = {
  value: string
  onChange?: (value: string) => void
  className?: string
  minHeight?: string
}

export function MDEditor({
  value,
  onChange,
  className,
  minHeight = '200px',
}: MDEditorProps) {
  const { theme } = useTheme()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const editorRef = React.useRef<EditorView>(null)
  const [uploading, setUploading] = React.useState(false)

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })

      // 获取当前光标位置
      const view = editorRef.current
      if (view) {
        const pos = view.state.selection.main.head
        const imageMarkdown = `![${file.name}](${blob.url})`

        // 在光标位置插入图片链接
        const transaction = view.state.update({
          changes: {
            from: pos,
            to: pos,
            insert: imageMarkdown,
          },
        })
        view.dispatch(transaction)
      }
    } catch (error) {
      console.error('上传图片失败:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleImageUpload(file)
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4 mr-2" />
          )}
          {uploading ? '上传中...' : '插入图片'}
        </Button>
      </div>
      <div className={cn('w-full overflow-auto flex', className)}>
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
          className="flex-1 w-0"
          minHeight={minHeight}
          onCreateEditor={(view) => {
            editorRef.current = view
          }}
        />
      </div>
    </div>
  )
}
