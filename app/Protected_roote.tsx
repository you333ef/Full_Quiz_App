'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const Protected_roote = ({ children,ROLE }:any) => {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  

  useEffect(() => {
    const TOKEN = localStorage.getItem('token')
    const role=localStorage.getItem('role')
  
    if (!TOKEN) {
        toast.error('<Token Not Found/>')
      router.push('/AuthLayout/login')
    } 
    else {
      setIsAuth(true)    
    }
     if(ROLE !== role){
            toast.error('<Errore in Role/>')
         localStorage.clear();
      router.push('/AuthLayout/login')


  }
  }, [])
 

  if (!isAuth) return null 
   

  return <>

  {children}
  </>
}

export default Protected_roote
