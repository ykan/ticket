'use client'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { useUserById } from '@/hooks/use-user-by-id'

type UserProps = {
  userId?: string
  className?: string
}

export function UserAvatar({ userId, className }: UserProps) {
  const { user } = useUserById(userId)

  return (
    <Avatar className={className}>
      {user?.imageUrl ? (
        <AvatarImage src={user.imageUrl} alt={user.name || user.id} />
      ) : null}
      <AvatarFallback>?</AvatarFallback>
    </Avatar>
  )
}
