import { supabase } from '@/lib/supabase'

export async function getSnapshotData(ticketNo: string, orgId: string) {
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
