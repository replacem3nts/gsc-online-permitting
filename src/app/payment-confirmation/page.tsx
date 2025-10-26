'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense, useRef } from 'react'
// import TemporaryPermit from '@/components/TemporaryPermit' // No longer needed - using screenshot

function PaymentConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(true)
  const [updateStatus, setUpdateStatus] = useState<'updating' | 'success' | 'error'>('updating')
  const [userData, setUserData] = useState<any>(null)
  const [showPermit, setShowPermit] = useState(false)
  const hasInitialized = useRef(false)
  
  const userId = searchParams.get('userId')

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
    if (!userId) return null
    
    try {
      const response = await fetch(`/api/user/${userId}`)
      if (response.ok) {
        const user = await response.json()
        setUserData(user)
        return user
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
    return null
  }

  // Print function for temporary permit
  const printTemporaryPermit = () => {
    if (userData?.paymentCompleted && userData?.permitScreenshot) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Temporary Shellfish Permit</title>
            <style>
              @page {
                size: 8.5in 11in;
                margin: 0;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              html, body {
                width: 8.5in;
                height: 11in;
                margin: 0;
                padding: 0;
                background: white;
                overflow: hidden;
              }
              .permit-image {
                width: 8.5in;
                height: auto;
                display: block;
                margin: 0;
                padding: 0;
                border: none;
                position: absolute;
                top: 0;
                left: 0;
              }
            </style>
          </head>
          <body>
            <img src="${userData.permitScreenshot}" alt="Temporary Shellfish Permit" class="permit-image" onload="window.print();" />
            <script>
              window.onfocus = function() { 
                setTimeout(function() { window.close(); }, 300); 
              }
            </script>
          </body>
        </html>
        `)
        printWindow.document.close()
      }
    }
  }

  useEffect(() => {
    if (!userId) {
      router.push('/')
      return
    }

    // Prevent double execution
    if (hasInitialized.current) {
      return
    }
    hasInitialized.current = true

    // Set a 3-second timeout before showing the permit
    setTimeout(() => {
      setShowPermit(true)
    }, 3000)

    // Fetch user data and update payment status
    const initializePage = async () => {
      try {
        // Fetch user data first
        const currentUserData = await fetchUserData()
        
        // Check if payment has already been completed
        if (currentUserData?.paymentCompleted) {
          console.log('Payment already completed, skipping update')
          setUpdateStatus('success')
          setIsUpdating(false)
          // Still fetch user data to ensure we have the latest screenshot info
          await fetchUserData()
          return
        }
        
        // Update payment status first (this generates the permit number)
        const updateResponse = await fetch('/api/update-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            paymentId: `payment_${Date.now()}`,
          }),
        })

        if (!updateResponse.ok) {
          throw new Error('Failed to update payment status')
        }

        // Get the updated user data from the response
        const updateResult = await updateResponse.json()
        
        // Fetch updated user data to check if screenshot already exists
        const updatedUserData = await fetchUserData()
        
        // Now capture screenshot of the permit only if it doesn't already exist
        if (!updatedUserData?.permitScreenshot) {
          let screenshotBlobUrl = null
          try {
            const screenshotResponse = await fetch('/api/capture-permit-screenshot', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                userData: updatedUserData,
              }),
            })

            if (screenshotResponse.ok) {
              const screenshotData = await screenshotResponse.json()
              screenshotBlobUrl = screenshotData.blobUrl
              console.log('Permit screenshot uploaded to Vercel Blob:', screenshotBlobUrl)
              
              // Update the user record with the blob URL
              await fetch('/api/update-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId,
                  paymentId: `payment_${Date.now()}`,
                  permitScreenshot: screenshotBlobUrl,
                }),
              })
              
              // Refresh user data to get the updated screenshot URL
              await fetchUserData()
            } else {
              console.warn('Failed to capture permit screenshot, but payment was successful')
            }
          } catch (screenshotError) {
            console.warn('Error capturing permit screenshot:', screenshotError)
            // Don't fail the entire process if screenshot fails
          }
        } else {
          console.log('Screenshot already exists, skipping creation')
        }

        setUpdateStatus('success')
      } catch (error) {
        console.error('Error updating payment status:', error)
        setUpdateStatus('error')
      } finally {
        setIsUpdating(false)
      }
    }

    initializePage()
  }, [userId, router])

  // Check if payment is already completed when userData is loaded
  useEffect(() => {
    if (userData?.paymentCompleted && isUpdating) {
      console.log('Payment already completed, setting success status')
      setUpdateStatus('success')
      setIsUpdating(false)
    }
  }, [userData, isUpdating])

  // Debug effect to see what's happening
  useEffect(() => {
    console.log('Payment confirmation page state:', { 
      isUpdating, 
      updateStatus,
      showPermit,
      hasScreenshot: !!userData?.permitScreenshot,
      userData: userData ? { 
        paymentCompleted: userData.paymentCompleted, 
        permitScreenshot: userData.permitScreenshot,
        permitNumber: userData.permitNumber,
        paymentDate: userData.paymentDate
      } : null 
    })
    console.log('Should show permit:', showPermit && !!userData?.permitScreenshot)
  }, [isUpdating, updateStatus, userData, showPermit])

  if (!userId) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'rgb(59, 102, 126)', borderColor: 'rgb(85, 85, 85)' }}>
              <div className="p-12">
                <div className="bg-white rounded-lg p-6 text-center">
                  <h1 className="text-2xl font-bold mb-4" style={{ color: 'rgb(85, 85, 85)' }}>Invalid Confirmation Request</h1>
                  <p className="mb-6" style={{ color: 'rgb(85, 85, 85)' }}>Please start your application from the beginning.</p>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full text-white py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    style={{ 
                      backgroundColor: 'rgba(18, 62, 45, 0.9)'
                    }}
                  >
                    Start Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {isUpdating && (
          <div className="text-center mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'rgb(59, 102, 126)' }}></div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(85, 85, 85)' }}>Processing Your Payment</h2>
            <p style={{ color: 'rgb(85, 85, 85)' }}>
              Please wait while we confirm your payment and activate your permit...
            </p>
          </div>
        )}

        {!isUpdating && updateStatus === 'success' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>
                Payment Confirmed
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-center" style={{ color: 'rgb(85, 85, 85)' }}>
                Your purchase of a shellfish permit has been completed successfully.
              </p>
            </div>

          </>
        )}

        {!isUpdating && updateStatus === 'success' && (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'rgb(59, 102, 126)', borderColor: 'rgb(85, 85, 85)' }}>
              <div className="p-12">
                <div className="bg-white rounded-lg p-6">
                  {/* Next Steps Section */}
                  <div className="mb-8 max-w-xl mx-auto p-4">
                    <h3 className="text-2xl font-bold mb-6 underline" style={{ color: 'rgb(59, 102, 126)' }}>Next Steps:</h3>
                    <ol className="text-lg space-y-3 text-left" style={{ color: 'rgb(85, 85, 85)' }}>
                      <li className="flex items-start">
                        <span className="text-2xl mr-3 font-bold" style={{ color: 'rgb(59, 102, 126)' }}>1.</span>
                        <span>A permanent copy of your permit will be mailed to the address you provided in the next two weeks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl mr-3 font-bold" style={{ color: 'rgb(59, 102, 126)' }}>2.</span>
                        <span>Displayed below is a temporary permit which can be printed for use until your permanent copy arrives</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl mr-3 font-bold" style={{ color: 'rgb(59, 102, 126)' }}>3.</span>
                        <span>Contact the Shellfish Commission if you have any questions</span>
                      </li>
                    </ol>
                  </div>

                  {/* Divider */}
                  <div className="my-8">
                    <hr style={{ borderColor: 'rgb(85, 85, 85)', borderWidth: '1px' }} />
                  </div>

                  <div className="text-center">
            {/* Temporary Permit Screenshot */}
            <div className="mb-6">
              {showPermit && userData?.permitScreenshot ? (
                <div className="flex justify-center">
                  <img 
                    src={userData.permitScreenshot}
                    alt="Temporary Shellfish Permit"
                    className="w-full max-w-4xl h-auto border-2 border-gray-300 rounded-lg shadow-lg mx-auto"
                    onError={(e) => {
                      // If image fails to load, show generating message
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'block';
                      }
                    }}
                  />
                  <div className="text-center text-gray-500 py-8" style={{ display: 'none' }}>
                    <p>Please wait, your temporary permit is being generated...</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Please wait, your temporary permit is being generated...</p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: 'rgb(59, 102, 126)' }}></div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="my-8">
              <hr style={{ borderColor: 'rgb(85, 85, 85)', borderWidth: '1px' }} />
            </div>

              <div className="space-y-4 mt-4">
                <button
                  onClick={printTemporaryPermit}
                  disabled={!showPermit || !userData?.permitScreenshot}
                  className="w-full text-white py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    backgroundColor: 'rgba(18, 62, 45, 0.9)'
                  }}
                >
                  Print Temporary Permit
                </button>
                <button
                  onClick={() => window.open('https://www.greenwichct.gov/696/Shellfish-Commission', '_blank')}
                  className="w-full text-white py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  style={{ 
                    backgroundColor: 'rgb(85, 85, 85)'
                  }}
                >
                  Return to Home
                </button>
              </div>
            </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {!isUpdating && updateStatus === 'error' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>
                Payment Update Failed
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-left" style={{ color: 'rgb(85, 85, 85)' }}>
                There was an error updating your payment status. Please contact support.
              </p>
            </div>

            {/* Error Details Section */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">What to do next:</h3>
                <ul className="text-sm text-red-700 space-y-1 text-left">
                  <li>• Contact the Greenwich Shellfish Commission</li>
                  <li>• Provide your payment reference: {userId}</li>
                  <li>• They will manually verify and activate your permit</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {!isUpdating && updateStatus === 'error' && (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'rgb(59, 102, 126)', borderColor: 'rgb(85, 85, 85)' }}>
              <div className="p-12">
                <div className="bg-white rounded-lg p-6 text-center">
                  <button
                    onClick={() => window.open('https://www.greenwichct.gov/696/Shellfish-Commission', '_blank')}
                    className="w-full text-white py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    style={{ 
                      backgroundColor: 'rgba(18, 62, 45, 0.9)'
                    }}
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'rgb(59, 102, 126)', borderColor: 'rgb(85, 85, 85)' }}>
              <div className="p-12">
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: 'rgb(59, 102, 126)' }}></div>
                  <p style={{ color: 'rgb(85, 85, 85)' }}>Loading confirmation page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  )
}
