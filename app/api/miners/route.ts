import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const user = await auth()
    const { searchParams } = new URL(request.url)
    const farm_id = searchParams.get('farm_id')
    const status = searchParams.get('status')
    const ids = searchParams.get('ids')

    // 构建查询
    let query = supabase
      .from('miner')
      .select()
      .eq('workspace_id', user.orgId)
      .limit(100)

    // 添加筛选条件
    if (farm_id) {
      query = query.eq('farm_id', farm_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // 如果传入了 ids 参数，添加 id 筛选
    if (ids) {
      const minerIds = ids.split(',').map((id) => parseInt(id))
      query = query.in('id', minerIds)
    }

    // 执行查询
    const { data, error } = await query

    if (error) {
      console.error('获取矿机列表失败:', error)
      return NextResponse.json({ error: '获取矿机列表失败' }, { status: 500 })
    }

    return NextResponse.json({
      data,
    })
  } catch (error) {
    console.error('获取矿机列表失败:', error)
    return NextResponse.json({ error: '获取矿机列表失败' }, { status: 500 })
  }
}
