'use client'
import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '@/lib/request'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MDEditor } from '@/components/md-editor'
import { TicketLevel } from '@/components/ticket-level'
import { Enums } from '@/lib/supabase.types'

function LevelItem({ level }: { level: Enums<'ticket_level'> }) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={level} id={level} />
      <TicketLevel level={level} />
    </div>
  )
}

export function TicketDialog() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [level, setLevel] = React.useState('P2')
  const [description, setDescription] = React.useState('')
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async () => {
      return request.post('/ticket', {
        title,
        level,
        description,
      })
    },
    onSuccess: () => {
      setOpen(false)
      setTitle('')
      setLevel('P2')
      setDescription('')
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">创建工单</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建工单</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入工单标题"
            />
          </div>

          <div className="space-y-2">
            <RadioGroup
              value={level}
              onValueChange={setLevel}
              className="flex gap-4"
            >
              <LevelItem level="P0" />
              <LevelItem level="P1" />
              <LevelItem level="P2" />
              <LevelItem level="P3" />
              <LevelItem level="P4" />
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <MDEditor
              className="max-h-[500px]"
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !title || !level}
            >
              {createMutation.isPending ? '创建中...' : '创建'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
