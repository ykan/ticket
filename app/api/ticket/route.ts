import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server'

async function createTicket(request: Request, user: ClerkMiddlewareAuthObject) {
  const body = await request.json()
  // 验证必填字段
  if (!body.title || !body.level) {
    return NextResponse.json({ error: '缺少必要字段' }, { status: 400 })
  }

  // 从 settings 表中获取 last_no 并更新 +1
  const { data: settings, error: settingsError } = await supabase
    .from('settings')
    .select('last_no')
    .eq('workspace_id', user.orgId)
    .single()
  if (settingsError) {
    throw settingsError
  }
  const lastNo = settings?.last_no || 1
  const newNo = lastNo + 1
  const { error: updateError } = await supabase
    .from('settings')
    .update({ last_no: newNo })
    .eq('workspace_id', user.orgId)
  if (updateError) {
    throw updateError
  }

  // 创建工单
  const { error } = await supabase
    .from('ticket')
    .insert({
      workspace_id: user.orgId,
      assignee_id: body.assignee_id || user.userId,
      title: body.title,
      no: lastNo,
      description: body.description,
      status: 'Todo',
      origin_level: body.level || body.origin_level,
      level: body.level,
      miners: body.miners || [],
      farm_id: body.farm_id,
    })
    .select()
    .single()
  if (error) {
    throw error
  }
}

export async function POST(request: Request) {
  // 用 clerk api 获取当前用户信息
  const user = await auth()
  try {
    await createTicket(request, user)
    return NextResponse.json({ message: '工单创建成功' }, { status: 200 })
  } catch (error) {
    console.error('创建工单失败:', error)
    return NextResponse.json({ error: '创建工单失败' }, { status: 500 })
  }
}
