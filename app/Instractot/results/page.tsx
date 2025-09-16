'use client'

import axios from 'axios'
import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { FaChartBar } from 'react-icons/fa'

const Taple_SHared = dynamic(() => import('../../Shared_component/Taple_SHared'), {
  ssr: false,
  loading: () => <div>Loading table...</div>,
})

interface QuizResult {
  quiz: {
    title: string
    code: string
    status: string
    duration: number
    createdAt: string
  }
}

const Page = () => {
  const [save_results, setSave_Results] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const GET_RESULTS = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      const response = await axios.get('https://upskilling-egypt.com:3005/api/quiz/result', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSave_Results(response.data)
      setError(null)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || 'Failed to fetch quiz results'
      setError(errorMessage)
      console.error('Error details:', {
        message: errorMessage,
        status: error?.response?.status,
        data: error?.response?.data,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    GET_RESULTS()
  }, [])

  const rows = useMemo(
    () =>
      save_results.map((item) => ({
        title: item.quiz.title,
        code: item.quiz.code,
        status: item.quiz.status,
        duration: item.quiz.duration,
        createdAt: new Date(item.quiz.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      })),
    [save_results]
  )

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
          <h4 className="text-lg font-semibold">Quizzes Results</h4>
          <FaChartBar className="text-xl" />
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {loading ? (
          <SkeletonLoader />
        ) : (
          <Taple_SHared
            rows={rows}
            T_Head={['title', 'code', 'status', 'duration', 'createdAt']}
          />
        )}
      </div>
    </div>
  )
}

export default Page