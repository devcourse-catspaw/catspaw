import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

// 로그인 상태 전역관리
export default function useAuthInit() {
  const { fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [])
}
