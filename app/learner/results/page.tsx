'use client'
import axios from "axios"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { FaChartBar } from "react-icons/fa";
const Taple_SHared = dynamic(
  () => import('../../Shared_component/Taple_SHared'),
  { ssr: false }
);

const Page = () => {

  const [save_results, setSave_Results] = useState<any[]>([])

  const GET_RESULTS = async () => {
    try {
      const tokenn = localStorage.getItem('token');
      const response = await axios.get(
        'https://upskilling-egypt.com:3005/api/quiz/result',
        { headers: { Authorization: `Bearer ${tokenn}` } }
      );
      setSave_Results(response.data)
    } catch (error: any) {
      console.log(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    GET_RESULTS()
  }, [])

  
  let T_Head = [
    "title",
    "code",
    "score",
   
    "duration",
   
    "createdAt",
   
  ];

  
  const rows = save_results?.map((item: any) => {
    return {
      title: item.quiz.title,
      code: item.quiz.code,
      score: item.result?.score ?? 0,
    
      duration: item.quiz.duration,
     
      createdAt: new Date(item.quiz.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
     
    }
  }) || []

  return (
    <div className="p-6" style={{overflow:'hidden',margin:'auto',justifyContent:'center',alignItems:'center'}}>
  <div className="flex justify-center items-center gap-2 p-5">
  <h1 className="text-lg font-semibold" >Quizes results</h1>
  <FaChartBar className="text-xl" />
</div>

     
     
      <Taple_SHared
        rows={rows}
        T_Head={T_Head}
       
      />
    </div>
  )
}

export default Page
