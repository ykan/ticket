'use client'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

export function MDTypography({ children }: { children: React.ReactNode }) {
  return (
    <article className="prose dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80">
      {children}
    </article>
  )
}

export function MDViewer({ content }: { content: string }) {
  return (
    <MDTypography>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </MDTypography>
  )
}
