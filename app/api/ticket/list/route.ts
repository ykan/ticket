import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 获取工单列表
    const tickets = await supabase.from('ticket').select()
    // console.log('获取工单列表成功:', tickets) // 添加这一行日志，以便在控制台中查看 t

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('获取工单列表失败:', error)
    return NextResponse.json({ error: '获取工单列表失败' }, { status: 500 })
  }
}
