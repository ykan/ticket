'use client'
import * as React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'
import { MDTypography, MDViewer } from '@/components/md-viewer'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { TicketLevel } from '@/components/ticket-level'
import { TicketStatus } from '@/components/ticket-status'
import { MDEditor } from '@/components/md-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Link } from '@/lib/navigation'

import { Log, LogType } from './log'
import { LogSender } from './log-sender'

export default function Ticket() {
  const { no } = useParams<{ no: string }>()
  const [isEditing, setIsEditing] = React.useState(false)
  const [description, setDescription] = React.useState('')
  const [title, setTitle] = React.useState('')

  const { data = {}, isLoading } = useQuery({
    queryKey: ['ticket', no],
    queryFn: async () => {
      const res = await request.get(`/ticket/${no}`)
      setDescription(res.data?.description || '')
      setTitle(res.data?.title || '')
      return res.data
    },
  })

  const { data: logsData = [] } = useQuery({
    queryKey: ['ticket-logs', no],
    queryFn: async () => {
      const res = await request.get(`/ticket/${no}/logs`)
      return res.data
    },
  })
  const detail = data as Tables<'ticket'>
  const logs = logsData as LogType[]

  const updateMutation = useMutation({
    mutationFn: async () => {
      return request.patch(`/ticket/${no}`, {
        title,
        description,
      })
    },
    onSuccess: () => {
      setIsEditing(false)
    },
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    updateMutation.mutate()
  }

  const renderLogs = () => {
    if (isEditing || !logs?.length) {
      return null
    }

    return (
      <div className="border-t-[0.5px] py-4">
        <h2 className="text-lg font-semibold mb-4">操作日志</h2>
        <LogSender className="mb-4" />
        <div className="space-y-4">
          {logs.map((log) => (
            <Log key={log.id} log={log} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageView loading={isLoading}>
      <PageHead>
        <div className="flex items-center gap-4 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/dashboard">工作台</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span>工单 #{detail.no}</span>
                <TicketStatus
                  status={detail.status}
                  className="mr-1"
                  showText
                />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          {isEditing ? (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? '保存中...' : '保存'}
            </Button>
          ) : (
            <Button size="sm" onClick={handleEdit}>
              编辑
            </Button>
          )}
        </div>
      </PageHead>
      <PageBody className="px-10 py-5">
        <div className="w-full lg:max-w-5xl mx-auto">
          <div className="mb-4 flex items-center">
            <TicketLevel level={detail.level} className="mr-2 w-8 h-8" />
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入工单标题"
                />
              ) : (
                <MDTypography>
                  <h1>{title}</h1>
                </MDTypography>
              )}
            </div>
          </div>
          <div className="mb-4">
            {isEditing ? (
              <MDEditor value={description} onChange={setDescription} />
            ) : (
              <MDViewer content={description} />
            )}
          </div>
          {renderLogs()}
        </div>
      </PageBody>
    </PageView>
  )
}
