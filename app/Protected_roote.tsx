'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Protected_roote = ({ children, ROLE }: { children: React.ReactNode; ROLE: string }) => {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    const TOKEN = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!TOKEN || ROLE !== role) {
      console.log(!TOKEN ? 'Token Not Found' : 'Error in Role')
      localStorage.clear()
      router.push('/AuthLayout/login')
      return
    }

    setIsAuth(true)
  }, [router, ROLE])

  if (isAuth === null) return <div>Loading...</div>
  if (!isAuth) return null

  return <>{children}</>
}

export default Protected_roote