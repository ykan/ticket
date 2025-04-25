import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: ticket, error } = await supabase
      .from('ticket')
      .select()
      .eq('id', id)
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
