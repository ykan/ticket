'use client'
import * as React from 'react'
import dayjs from 'dayjs'
import { Tables, Enums } from '@/lib/supabase.types'
import { MDViewer } from '@/components/md-viewer'
import { TicketLevel } from '@/components/ticket-level'
import { TicketStatus } from '@/components/ticket-status'
import { UserAvatar } from '@/components/user-avatar'
import { FarmDisplay } from '@/components/farm-display'

interface SnapshotData {
  farm: Tables<'farm'>
  miners?: Tables<'miner'>[]
}

interface RemarkData {
  content: string
}

interface LevelChangeData {
  from: Enums<'ticket_level'>
  to: Enums<'ticket_level'>
}

interface AssigneeChangeData {
  from: string
  to: string
}

interface StatusChangeData {
  from: Enums<'ticket_status'>
  to: Enums<'ticket_status'>
}

type LogData = {
  Snapshot: SnapshotData
  Remark: RemarkData
  LevelChange: LevelChangeData
  AssigneeChange: AssigneeChangeData
  StatusChange: StatusChangeData
}

function formatDate(date?: string | null) {
  if (!date) {
    return ''
  }
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export type TicketLogType = Tables<'operate_log'> & {
  data: LogData[keyof LogData]
}

export function TicketLog({ log }: { log?: TicketLogType }) {
  const renderLog = () => {
    if (!log?.data) return null

    switch (log.type) {
      case 'Snapshot': {
        const data = log.data as SnapshotData
        return <FarmDisplay farm={data.farm} miners={data.miners} />
      }
      case 'AssigneeChange': {
        const data = log.data as AssigneeChangeData
        return (
          <div className="flex gap-1">
            <span>处理人由</span>
            <UserAvatar className="inline-flex w-6 h-6" userId={data.from} />
            <span>变更为</span>
            <UserAvatar className="inline-flex w-6 h-6" userId={data.to} />
          </div>
        )
      }
      case 'Remark': {
        const data = log.data as RemarkData
        return <MDViewer content={data.content} />
      }
      case 'LevelChange': {
        const data = log.data as LevelChangeData
        return (
          <div className="text-sm text-muted-foreground flex items-center">
            <span>工单等级从</span>
            <TicketLevel level={data.from} />
            <span>变更为</span>
            <TicketLevel level={data.to} />
          </div>
        )
      }
      case 'AssigneeChange': {
        const data = log.data as AssigneeChangeData
        return (
          <div className="text-sm text-muted-foreground">
            处理人从 {data.from || '未分配'} 变更为 {data.to || '未分配'}
          </div>
        )
      }
      case 'StatusChange': {
        const data = log.data as StatusChangeData
        return (
          <div className="text-sm text-muted-foreground flex items-center">
            <span>工单状态从</span>
            <TicketStatus status={data.from} showText />
            <span>变更为</span>
            <TicketStatus status={data.to} showText />
          </div>
        )
      }
      default:
        return <div className="text-sm text-muted-foreground">未知类型</div>
    }
  }
  return (
    <div className="p-4 rounded-lg bg-muted/50">
      <div className="flex justify-between mb-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {formatDate(log?.created_at)}
        </div>
      </div>
      {renderLog()}
    </div>
  )
}
