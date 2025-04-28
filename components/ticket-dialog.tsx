'use client'
import * as React from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'
import { Check, ChevronsUpDown } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MDEditor } from '@/components/md-editor'
import { TicketLevel } from '@/components/ticket-level'
import { FarmMinerStatus } from '@/components/farm-miner-status'
import { Enums, Tables } from '@/lib/supabase.types'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function LevelItem({ level }: { level: Enums<'ticket_level'> }) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={level} id={level} />
      <TicketLevel level={level} />
    </div>
  )
}

export function TicketDialog() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [level, setLevel] = React.useState('P2')
  const [description, setDescription] = React.useState('')
  const [farmId, setFarmId] = React.useState<number>()
  const [minerIds, setMinerIds] = React.useState<number[]>([])
  const [farmOpen, setFarmOpen] = React.useState(false)
  const [minersOpen, setMinersOpen] = React.useState(false)
  const queryClient = useQueryClient()

  // 获取矿场列表
  const { data: farms = [] } = useQuery<Tables<'farm'>[]>({
    queryKey: ['farms'],
    queryFn: async () => {
      const res = await request.get('/farms')
      return res.data
    },
  })

  // 获取矿机列表
  const { data: miners = [] } = useQuery<Tables<'miner'>[]>({
    queryKey: ['miners', farmId],
    queryFn: async () => {
      if (!farmId) return []
      const res = await request.get(`/miners?farm_id=${farmId}`)
      return res.data
    },
    enabled: !!farmId,
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      return request.post('/ticket', {
        title,
        level,
        description,
        farm_id: farmId,
        miners: minerIds,
      })
    },
    onSuccess: () => {
      setOpen(false)
      setTitle('')
      setLevel('P2')
      setDescription('')
      setFarmId(undefined)
      setMinerIds([])
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    },
  })

  const selectedFarm = React.useMemo(() => {
    return farms.find((farm) => farm.id === farmId)
  }, [farms, farmId])

  const selectedMiners = React.useMemo(() => {
    return miners.filter((miner) => minerIds.includes(miner.id))
  }, [miners, minerIds])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">创建工单</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建工单</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入工单标题"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Popover open={farmOpen} onOpenChange={setFarmOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={farmOpen}
                    className="w-full justify-between"
                  >
                    {selectedFarm?.name || '选择矿场'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="搜索矿场..." />
                    <CommandEmpty>未找到矿场</CommandEmpty>
                    <CommandGroup>
                      {farms.map((farm) => (
                        <CommandItem
                          key={farm.id}
                          onSelect={() => {
                            setFarmId(farm.id)
                            setMinerIds([])
                            setFarmOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              farmId === farm.id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <span className="inline-flex items-center">
                            <FarmMinerStatus status={farm.status} />
                            <span className="ml-2">{farm.name}</span>
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Popover open={minersOpen} onOpenChange={setMinersOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={minersOpen}
                    className="w-full justify-between"
                    disabled={!farmId}
                  >
                    {selectedMiners.length
                      ? `已选择 ${selectedMiners.length} 台矿机`
                      : '选择矿机'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="搜索矿机..." />
                    <CommandEmpty>未找到矿机</CommandEmpty>
                    <CommandGroup>
                      {miners.map((miner) => (
                        <CommandItem
                          key={miner.id}
                          onSelect={() => {
                            setMinerIds((prev) => {
                              if (prev.includes(miner.id)) {
                                return prev.filter((id) => id !== miner.id)
                              }
                              return [...prev, miner.id]
                            })
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              minerIds.includes(miner.id)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          <div className="flex">
                            <div>
                              <FarmMinerStatus status={miner.status} />
                            </div>
                            <div className="flex flex-col ml-2">
                              <span>{miner.hostname}</span>
                              <span className="text-xs text-muted-foreground">
                                {miner.ip_address}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <RadioGroup
              value={level}
              onValueChange={setLevel}
              className="flex gap-4"
            >
              <LevelItem level="P0" />
              <LevelItem level="P1" />
              <LevelItem level="P2" />
              <LevelItem level="P3" />
              <LevelItem level="P4" />
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <MDEditor
              className="max-h-[500px]"
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => createMutation.mutate()}
              disabled={
                createMutation.isPending ||
                !title ||
                !level ||
                !farmId ||
                !minerIds.length
              }
            >
              {createMutation.isPending ? '创建中...' : '创建'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
