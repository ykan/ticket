import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const user = await auth()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // 构建查询
    let query = supabase
      .from('farm')
      .select()
      .eq('workspace_id', user.orgId)
      .limit(100)

    if (status) {
      query = query.eq('status', status)
    }

    // 执行查询
    const { data, error } = await query

    if (error) {
      console.error('获取矿场列表失败:', error)
      return NextResponse.json({ error: '获取矿场列表失败' }, { status: 500 })
    }

    return NextResponse.json({
      data,
    })
  } catch (error) {
    console.error('获取矿场列表失败:', error)
    return NextResponse.json({ error: '获取矿场列表失败' }, { status: 500 })
  }
}
