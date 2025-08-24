'use client'

import axios from 'axios'
import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { FaChartBar } from 'react-icons/fa'

const Taple_SHared = dynamic(() => import('../../Shared_component/Taple_SHared'), {
  ssr: false,
  loading: () => <div>Loading table...</div>, // Fallback UI
})


interface QuizResult {
  quiz: {
    title: string
    code: string
    duration: number
    started_at: string
  }
  result?: {
    score: number
  }
}

const Page = () => {
  const [save_results, setSave_Results] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Debounced API call to avoid multiple rapid calls
  const GET_RESULTS = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('https://upskilling-egypt.com:3005/api/quiz/result', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000, // Set timeout to avoid hanging
      })
      setSave_Results(response.data)
      setError(null)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to fetch quiz results'
      setError(errorMessage)
      console.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      GET_RESULTS()
    }, 300) 

    return () => clearTimeout(debounceFetch) // Cleanup
  }, [])

  // Memoize rows to prevent unnecessary recalculations
  const rows = useMemo(
    () =>
      save_results.map((item) => ({
        title: item.quiz.title,
        code: item.quiz.code,
        score: item.result?.score ?? 0,
        duration: item.quiz.duration,
        started_at: new Date(item.result.started_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      })),
    [save_results]
  )

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  )

  return (
    <div className="p-6 flex justify-center items-center" style={{ overflow: 'hidden', margin: 'auto' }}>
      <div className="w-full max-w-4xl">
        <div className="flex justify-center items-center gap-2 p-5">
          <h1 className="text-lg font-semibold">Quizzes Results</h1>
          <FaChartBar className="text-xl" />
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <SkeletonLoader />
        ) : (
          <Taple_SHared
            rows={rows}
            T_Head={['title', 'code', 'score', 'duration', 'started_at']}
          />
        )}
      </div>
    </div>
  )
}

export default Page