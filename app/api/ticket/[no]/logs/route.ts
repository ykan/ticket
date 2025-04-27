import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ no: string }> }
) {
  const user = await auth()
  const { no } = await params
  try {
    // 先获取工单信息
    const { data: ticket, error: ticketError } = await supabase
      .from('ticket')
      .select()
      .eq('no', no)
      .eq('workspace_id', user.orgId)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json({ error: '工单不存在' }, { status: 404 })
    }

    // 获取工单的操作日志
    const { data: logs, error } = await supabase
      .from('operate_log')
      .select()
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取操作日志失败:', error)
      return NextResponse.json({ error: '获取操作日志失败' }, { status: 500 })
    }

    return NextResponse.json({
      data: logs,
    })
  } catch (error) {
    console.error('获取操作日志失败:', error)
    return NextResponse.json({ error: '获取操作日志失败' }, { status: 500 })
  }
}
