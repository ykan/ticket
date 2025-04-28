import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const user = await auth()
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const status = searchParams.get('status')

    // 构建查询
    let query = supabase
      .from('ticket')
      .select()
      .eq('workspace_id', user.orgId)
      .order('created_at', { ascending: false })
      .limit(100)

    // 添加筛选条件
    if (level) {
      query = query.eq('level', level)
    }
    if (status) {
      query = query.eq('status', status)
    }

    // 执行查询
    const { data, error } = await query

    if (error) {
      console.error('获取工单列表失败:', error)
      return NextResponse.json({ error: '获取工单列表失败' }, { status: 500 })
    }

    return NextResponse.json({
      data,
    })
  } catch (error) {
    console.error('获取工单列表失败:', error)
    return NextResponse.json({ error: '获取工单列表失败' }, { status: 500 })
  }
}
