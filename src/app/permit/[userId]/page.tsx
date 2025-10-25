'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import TemporaryPermit from '@/components/TemporaryPermit'

function PermitContent({ params }: { params: { userId: string } }) {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const userId = params.userId

  // Calculate expiration date (2 weeks from now)
  const getExpirationDate = () => {
    const now = new Date()
    const expirationDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)) // 14 days
    return expirationDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Format date of birth
  const formatDateOfBirth = () => {
    if (!userData) return ''
    const { dateOfBirthMonth, dateOfBirthDay, dateOfBirthYear } = userData
    return `${dateOfBirthMonth}/${dateOfBirthDay}/${dateOfBirthYear}`
  }

  // Fetch user data
  const fetchUserData = async () => {
    if (!userId) {
      setError('User ID is required')
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch(`/api/user/${userId}`)
      if (response.ok) {
        const user = await response.json()
        setUserData(user)
      } else {
        setError('User not found')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load permit data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permit...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Permit Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load permit data'}</p>
          <button
            onClick={() => window.close()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <TemporaryPermit
      userData={userData}
      userId={userId}
      amount={userData.paymentCompleted ? '25.00' : '0.00'}
      getExpirationDate={getExpirationDate}
      formatDateOfBirth={formatDateOfBirth}
    />
  )
}

export default async function PermitPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = await params
  return <PermitContent params={resolvedParams} />
}
