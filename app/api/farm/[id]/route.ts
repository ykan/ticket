import { NextResponse } from 'next/server'

import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await auth()
  const { id } = await params
  try {
    const { data: ticket, error } = await supabase
      .from('farm')
      .select()
      .eq('id', id)
      .eq('workspace_id', user.orgId)
      .single()

    if (error) {
      console.error('获取矿场详情失败:', error)
      return NextResponse.json({ error: '获取矿场详情失败' }, { status: 500 })
    }

    if (!ticket) {
      return NextResponse.json({ error: '矿场不存在' }, { status: 404 })
    }

    return NextResponse.json({ data: ticket })
  } catch (error) {
    console.error('获取矿场详情失败:', error)
    return NextResponse.json({ error: '获取矿场详情失败' }, { status: 500 })
  }
}
