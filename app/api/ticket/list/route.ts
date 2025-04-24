import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL = '', SUPABASE_ANON_KEY = '' } = process.env
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
