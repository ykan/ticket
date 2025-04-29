import { useQuery } from '@tanstack/react-query'
import { request } from '@/lib/request'

export function useUserById(userId?: string) {
  const { data, ...other } = useQuery({
    queryKey: ['user', userId],
    enabled: !!userId,
    queryFn: async () => {
      // 请求接口
      const res = await request.get(`/clerk/user/${userId}`)
      return res.data
    },
    staleTime: 3600 * 24 * 7,
  })
  return {
    user: data,
    ...other,
  }
}
