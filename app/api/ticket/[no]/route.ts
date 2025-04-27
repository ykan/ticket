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

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('获取工单详情失败:', error)
    return NextResponse.json({ error: '获取工单详情失败' }, { status: 500 })
  }
}
