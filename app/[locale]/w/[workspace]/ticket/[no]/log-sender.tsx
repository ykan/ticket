'use client'
import * as React from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MDEditor } from '@/components/md-editor'
import { Button } from '@/components/ui/button'
import { request } from '@/lib/request'
import { cn } from '@/lib/utils'

export function LogSender({ className }: { className?: string }) {
  const { no } = useParams<{ no: string }>()
  const [content, setContent] = React.useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      return request.post(`/ticket/${no}/log`, {
        type: 'Remark',
        data: {
          content,
        },
      })
    },
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['ticket-logs', no] })
    },
  })

  const handleSubmit = () => {
    if (!content.trim()) return
    mutation.mutate()
  }

  return (
    <div className={cn('p-4 rounded-lg bg-muted/50', className)}>
      <MDEditor value={content} onChange={setContent} minHeight="100px" />
      <div className="flex justify-end mt-2">
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending || !content.trim()}
        >
          {mutation.isPending ? '添加中...' : '添加备注'}
        </Button>
      </div>
    </div>
  )
}
