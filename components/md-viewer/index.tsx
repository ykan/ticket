'use client'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

export function MDViewer({ content }: { content: string }) {
  return (
    <article className="prose dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </article>
  )
}
