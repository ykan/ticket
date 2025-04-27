import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth, ClerkMiddlewareAuthObject } from '@clerk/nextjs/server'

async function createMiner(request: Request, user: ClerkMiddlewareAuthObject) {
  const body = await request.json()

  // 创建矿机
  const { data, error } = await supabase
    .from('miner')
    .insert({
      ...body,
      workspace_id: user.orgId,
      status: body.status || 'Offline',
      firmware: body.firmware || {
        version: 'unknown',
        type: 'unknown',
      },
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function POST(request: Request) {
  // 用 clerk api 获取当前用户信息
  const user = await auth()
  try {
    const miner = await createMiner(request, user)
    return NextResponse.json(
      { data: miner, message: '矿机创建成功' },
      { status: 200 }
    )
  } catch (error) {
    console.error('创建矿机失败:', error)
    return NextResponse.json({ error: '创建矿机失败' }, { status: 500 })
  }
}
