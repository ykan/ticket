'use client'
import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
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
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MDEditor } from '@/components/md-editor'

export function TicketDialog() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [level, setLevel] = React.useState('P2')
  const [description, setDescription] = React.useState('')

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
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">创建工单</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建工单</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>标题</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入工单标题"
            />
          </div>

          <div className="space-y-2">
            <Label>优先级</Label>
            <RadioGroup
              value={level}
              onValueChange={setLevel}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P0" id="p0" />
                <Label htmlFor="p0">P0</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P1" id="p1" />
                <Label htmlFor="p1">P1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P2" id="p2" />
                <Label htmlFor="p2">P2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P3" id="p3" />
                <Label htmlFor="p3">P3</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P4" id="p4" />
                <Label htmlFor="p4">P4</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>描述</Label>
            <MDEditor value={description} onChange={setDescription} />
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
