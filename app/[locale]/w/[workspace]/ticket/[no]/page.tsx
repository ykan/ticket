'use client'
import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'
import { MDTypography, MDViewer } from '@/components/md-viewer'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { TicketLevel } from '@/components/ticket-level'
import { TicketStatus } from '@/components/ticket-status'
import { MDEditor } from '@/components/md-editor'
import { TicketLog, TicketLogType } from '@/components/ticket-log'
import { TicketLogSender } from '@/components/ticket-log-sender'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { Link } from '@/lib/navigation'
import { FarmDisplay } from '@/components/farm-display'

export default function Ticket() {
  const { no } = useParams<{ no: string }>()
  const [isEditing, setIsEditing] = React.useState(false)
  const [description, setDescription] = React.useState('')
  const [title, setTitle] = React.useState('')
  const queryClient = useQueryClient()

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
  // 获取快照数据
  const { data: snapshotData } = useQuery({
    queryKey: ['ticket-snapshot', no],
    queryFn: async () => {
      const res = await request.get(`/ticket/${no}/snapshot`)
      return res.data
    },
  })
  const detail = data as Tables<'ticket'>
  const logs = logsData as TicketLogType[]

  const updateTicket = useMutation({
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

  const mutationSnapshot = useMutation({
    mutationFn: async () => {
      const res = await request.post(`/ticket/${no}/snapshot`)
      return res.data
    },
    onSuccess: () => {
      // 刷新工单日志列表和快照数据
      queryClient.invalidateQueries({ queryKey: ['ticket-logs', no] })
      queryClient.invalidateQueries({ queryKey: ['ticket-snapshot', no] })
    },
  })

  const handleSnapshot = () => {
    mutationSnapshot.mutate()
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    updateTicket.mutate()
  }

  const renderLogs = () => {
    if (isEditing || !logs?.length) {
      return null
    }

    return (
      <div className="border-t-[0.5px] py-4">
        <h2 className="text-lg font-semibold mb-4">操作日志</h2>
        <TicketLogSender className="mb-4" />
        <div className="space-y-4">
          {logs.map((log) => (
            <TicketLog key={log.id} log={log} />
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
              disabled={updateTicket.isPending}
            >
              {updateTicket.isPending ? '保存中...' : '保存'}
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
          <div className="p-4 rounded-lg bg-muted/50 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">相关矿机实时信息</h3>
              <Button
                size="sm"
                onClick={handleSnapshot}
                disabled={mutationSnapshot.isPending}
              >
                {mutationSnapshot.isPending ? '创建快照中...' : '创建快照'}
              </Button>
            </div>

            {snapshotData && (
              <FarmDisplay
                farm={snapshotData.farm}
                miners={snapshotData.miners}
              />
            )}
          </div>
          {renderLogs()}
        </div>
      </PageBody>
    </PageView>
  )
}
