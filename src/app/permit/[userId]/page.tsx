'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

function PermitContent({ params }: { params: { userId: string } }) {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const userId = params.userId

  // Format dates for ShellfishPermit component
  const getFormattedPaymentDate = () => {
    return userData?.paymentDate ? new Date(userData.paymentDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
  }

  const getFormattedExpirationDate = () => {
    return userData?.tempPermitExpirationDate ? new Date(userData.tempPermitExpirationDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : (() => {
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 14)
      return expirationDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
    })()
  }

  const formatDateOfBirth = () => {
    if (!userData?.dateOfBirthMonth || !userData?.dateOfBirthDay || !userData?.dateOfBirthYear) return 'N/A'
    return `${userData.dateOfBirthMonth.toString().padStart(2, '0')}/${userData.dateOfBirthDay.toString().padStart(2, '0')}/${userData.dateOfBirthYear}`
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
    <div className="bg-gray-800">
      <div className="relative w-[816px] h-[535px] m-0" style={{ backgroundImage: 'url(https://gscpermits.com/blank_permit.png)', backgroundSize: '100% 100%', backgroundPosition: 'top left', backgroundRepeat: 'no-repeat', position: 'absolute', top: '0', left: '0' }}>
        {/* Season */}
        <div className="absolute top-[185px] left-[45px] text-center">
          <div className="text-[18px] font-bold">'25 - '26</div>
        </div>

        {/* Permit Number */}
        <div className="absolute top-[185px] left-[235px] text-center">
          <div className="text-[18px] font-bold">{userData?.permitNumber || '001'}</div>
        </div>

        {/* Issued Date */}
        <div className="absolute top-[260px] left-[45px] text-center">
          <div className="text-[16px] font-bold">{getFormattedPaymentDate()}</div>
        </div>

        {/* Expires Date */}
        <div className="absolute top-[260px] left-[235px] text-center">
          <div className="text-[16px] font-bold">{getFormattedExpirationDate()}</div>
        </div>

        {/* Name */}
        <div className="absolute top-[105px] left-[450px]">
          <div className="text-[16px] font-bold">{`${userData?.firstName} ${userData?.lastName}`}</div>
        </div>

        {/* Height */}
        <div className="absolute top-[175px] left-[450px] text-center">
          <div className="text-[16px] font-bold">{userData?.height}</div>
        </div>

        {/* D.O.B. */}
        <div className="absolute top-[175px] left-[570px] text-center">
          <div className="text-[14px] font-bold">{formatDateOfBirth()}</div>
        </div>

        {/* Eye Color */}
        <div className="absolute top-[175px] left-[695px] text-center">
          <div className="text-[16px] font-bold">{userData?.eyeColor}</div>
        </div>
      </div>
    </div>
  )
}

export default async function PermitPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = await params
  return <PermitContent params={resolvedParams} />
}
