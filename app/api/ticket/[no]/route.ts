import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ no: string }> }
) {
  const user = await auth()
  try {
    const { no } = await params
    const { data: ticket, error } = await supabase
      .from('ticket')
      .select()
      .eq('no', no)
      .eq('workspace_id', user.orgId)
      .single()

    if (error) {
      console.error('获取工单详情失败:', error)
      return NextResponse.json({ error: '获取工单详情失败' }, { status: 500 })
    }

    if (!ticket) {
      return NextResponse.json({ error: '工单不存在' }, { status: 404 })
    }

    return NextResponse.json({ data: ticket })
  } catch (error) {
    console.error('获取工单详情失败:', error)
    return NextResponse.json({ error: '获取工单详情失败' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ no: string }> }
) {
  const user = await auth()
  try {
    const { no } = await params
    const body = await request.json()

    // 验证工单是否存在
    const { data: existingTicket, error: findError } = await supabase
      .from('ticket')
      .select()
      .eq('no', no)
      .eq('workspace_id', user.orgId)
      .single()

    if (findError || !existingTicket) {
      return NextResponse.json({ error: '工单不存在' }, { status: 404 })
    }

    // 更新工单信息
    const { data: ticket, error } = await supabase
      .from('ticket')
      .update({
        title: body.title,
        description: body.description,
        status: body.status,
        level: body.level,
        origin_level: body.origin_level,
        assignee_id: body.assignee_id,
        miners: body.miners,
        farm_id: body.farm_id,
      })
      .eq('no', no)
      .eq('workspace_id', user.orgId)
      .select()
      .single()

    if (error) {
      console.error('更新工单失败:', error)
      return NextResponse.json({ error: '更新工单失败' }, { status: 500 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('更新工单失败:', error)
    return NextResponse.json({ error: '更新工单失败' }, { status: 500 })
  }
}
