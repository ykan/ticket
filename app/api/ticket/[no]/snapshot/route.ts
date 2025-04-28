import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { getSnapshotData } from '@/lib/ticket'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ no: string }> }
) {
  const user = await auth()
  const { no } = await params

  try {
    const { farm, miners } = await getSnapshotData(no, user.orgId!)
    return NextResponse.json({ data: { farm, miners } })
  } catch (error) {
    console.error('获取快照信息失败:', error)
    return NextResponse.json(
      { error: (error as Error).message || '获取快照信息失败' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ no: string }> }
) {
  const user = await auth()
  const { no } = await params

  try {
    const { ticket, farm, miners } = await getSnapshotData(no, user.orgId!)

    // 创建快照记录
    const { error: logError } = await supabase.from('operate_log').insert({
      ticket_id: ticket.id,
      type: 'Snapshot',
      user_id: user.userId,
      data: {
        farm,
        miners,
      },
    })

    if (logError) {
      throw new Error('创建快照记录失败')
    }

    return NextResponse.json({ data: { farm, miners } })
  } catch (error) {
    console.error('创建快照记录失败:', error)
    return NextResponse.json(
      { error: (error as Error).message || '创建快照记录失败' },
      { status: 500 }
    )
  }
}
