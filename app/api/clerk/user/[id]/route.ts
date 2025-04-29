import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await clerkClient()
  const { id: userId } = await params

  try {
    // console.log('------- userId', userId)
    const user = await client.users.getUser(userId)
    // console.log('------- user', user)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    return NextResponse.json({ data: user })
  } catch {
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 })
  }
}
