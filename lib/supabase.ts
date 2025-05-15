import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL = '', SUPABASE_ANON_KEY = '' } = process.env
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * 获取快照数据
 */
export async function getSnapshotData(ticketNo: string, orgId: string) {
  const startTime = Date.now()
  // 先获取工单信息
  const { data: ticket, error: ticketError } = await supabase
    .from('ticket')
    .select()
    .eq('no', ticketNo)
    .eq('workspace_id', orgId)
    .single()

  console.log('----------- ticket', Date.now() - startTime, 'ms')
  if (ticketError || !ticket) {
    throw new Error('工单不存在')
  }

  // 获取矿场信息
  const { data: farm, error: farmError } = await supabase
    .from('farm')
    .select()
    .eq('id', ticket.farm_id)
    .single()

  console.log('----------- farm', Date.now() - startTime, 'ms')
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

    console.log('----------- miners', Date.now() - startTime, 'ms')
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

export async function getFarm(id: string) {
  const user = await auth()
  const { data, error } = await supabase
    .from('farm')
    .select()
    .eq('id', id)
    .eq('workspace_id', user.orgId)
    .single()
  if (error) {
    throw new Error('获取矿场信息失败')
  }
  return data
}

export async function getMiners(farmId: string) {
  const user = await auth()
  // 构建查询
  let query = supabase
    .from('miner')
    .select()
    .eq('workspace_id', user.orgId)
    .limit(100)

  // 添加筛选条件
  if (farmId) {
    query = query.eq('farm_id', farmId)
  }

  // 执行查询
  const { data, error } = await query
  if (error) {
    throw new Error('获取矿机列表失败')
  }
  return data
}
