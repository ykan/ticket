import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

async function getSnapshotData(ticketNo: string, orgId: string) {
  // 先获取工单信息
  const { data: ticket, error: ticketError } = await supabase
    .from('ticket')
    .select()
    .eq('no', ticketNo)
    .eq('workspace_id', orgId)
    .single()

  if (ticketError || !ticket) {
    throw new Error('工单不存在')
  }

  // 获取矿场信息
  const { data: farm, error: farmError } = await supabase
    .from('farm')
    .select()
    .eq('id', ticket.farm_id)
    .single()

  if (farmError) {
    throw new Error('获取矿场信息失败')
  }

  // 获取矿机信息
  let miners = []
  if (ticket.miners?.length) {
    const { data: minersData, error: minersError } = await supabase
      .from('miner')
      .select()
      .in('id', ticket.miners)
      .eq('farm_id', ticket.farm_id)

    if (minersError) {
      throw new Error('获取矿机信息失败')
    }

    miners = minersData || []
  }

  return {
    ticket,
    farm,
    miners,
  }
}

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
