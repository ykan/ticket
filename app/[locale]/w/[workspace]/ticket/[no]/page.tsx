'use client'
import * as React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { request } from '@/lib/request'
import { Tables } from '@/lib/supabase.types'
import { MDViewer } from '@/components/md-viewer'
import { PageView, PageHead, PageBody } from '@/components/page-view'
import { TicketLevel } from '@/components/ticket-level'
import { MDEditor } from '@/components/md-editor'
import { Button } from '@/components/ui/button'

export default function Ticket() {
  const { no } = useParams<{ no: string }>()
  const [isEditing, setIsEditing] = React.useState(false)
  const [description, setDescription] = React.useState('')

  const { data = {}, isLoading } = useQuery({
    queryKey: ['ticket', no],
    queryFn: async () => {
      const res = await request.get(`/ticket/${no}`)
      setDescription(res.data?.description || '')
      return res.data
    },
  })

  const { data: logsData = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['ticket-logs', no],
    queryFn: async () => {
      const res = await request.get(`/ticket/${no}/logs`)
      return res.data
    },
  })
  const detail = data as Tables<'ticket'>
  const logs = logsData as Tables<'operate_log'>[]

  const updateMutation = useMutation({
    mutationFn: async () => {
      return request.patch(`/ticket/${no}`, {
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
    if (isLoadingLogs) {
      return <div className="text-center text-muted-foreground">加载中...</div>
    }

    if (!logs.length) {
      return (
        <div className="text-center text-muted-foreground">暂无操作记录</div>
      )
    }

    return (
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {log.type}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {log.created_at}
              </div>
            </div>
            {log.data && (
              <div className="mt-2 text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <PageView loading={isLoading}>
      <PageHead>
        <TicketLevel level={detail.level} />
        <div className="w-15">#{detail.no}</div>
        <div className="w-20">{detail.status}</div>
        <div className="flex-1 min-w-0">{detail.title}</div>
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
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {isEditing ? (
              <MDEditor value={description} onChange={setDescription} />
            ) : (
              <MDViewer content={description} />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">操作日志</h2>
            {renderLogs()}
          </div>
        </div>
      </PageBody>
    </PageView>
  )
}
