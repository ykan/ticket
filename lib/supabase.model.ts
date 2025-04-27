/* eslint-disable */
// 类型设计
interface Settings {
  id: number // 唯一标识符
  workspaceId: string
  shortName: string
  lastNO: number
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

enum TicketStatus {
  TODO = 'Todo',
  DOING = 'Doing',
  CANCELED = 'Canceled',
  DONE = 'Done',
}

enum TicketLevel {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
}

interface Ticket {
  id: number // 唯一标识符
  workspaceId: string // 多租户ID
  no: string // 工单编号
  title: string // 工单标题
  description: string // 详细描述
  status: TicketStatus // 工单状态
  originLevel: TicketLevel // 初始优先级
  level: TicketLevel // 优先级

  // 关联信息
  assigneeId: string // 处理人 ID
  reporterId: string // 报告人 ID
  minerIds?: string[] // 关联矿机 ID 列表
  farmId?: string // 关联场地 ID（可选）

  // 元数据
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

enum OperateLogType {
  FarmSnapshot, // 矿场快照
  MinersSnapshot, // 矿机快照
  Remark, // 备注
  LevelChange, // 工单等级变更
  AssigneeChange, // 处理人变更
  StatusChange, // 工单状态变更
}

interface OperateLog {
  id: number // 唯一标识符
  ticketId: number // 关联工单 ID
  type: OperateLogType // 操作类型
  data: any // 操作数据
  // 元数据
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

enum FarmMinerStatus {
  Online, // 在线
  Offline, // 离线
  Error, // 故障
  Partial, // 部分机器故障
}

interface Farm {
  id: number // 场地 ID
  workspaceId: string // 所属工作空间 ID
  name: string // 场地名称
  status: FarmMinerStatus // 场地状态
  location: string // 位置信息
  eletricityFee: number // 电力信息
  createdAt: Date // 创建时间
  updatedAt: Date // 更新时间
}

interface Miner {
  id: number // 矿机 ID
  farmId: string // 所属场地 ID
  workspaceId: string // 所属工作空间 ID

  // 基本信息
  ipAddress: string // IP 地址
  macAddress?: string // MAC 地址
  hostname?: string // 主机名
  model: string // 矿机型号
  manufacturer: string // 制造商
  serialNumber?: string // 序列号

  // 状态信息
  status: FarmMinerStatus // 矿机状态
  isMining: boolean // 是否挖矿中
  lastSeen: Date // 最后在线时间

  // 固件信息
  firmware: {
    version: string // 固件版本
    type: string // 固件类型
  }

  // 其他信息
  location?: string // 机架位置
  notes?: string // 备注
  createdAt: Date // 添加时间
  updatedAt: Date // 更新时间
}
