'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { permitApplicationSchema, type PermitApplicationData } from '@/lib/validations'

const eyeColors = [
  'Brown', 'Blue', 'Green', 'Grey', 'Hazel'
]

const permitTypes = [
  { value: 'regular', label: 'Regular Permit', price: '$15' },
  { value: 'senior', label: 'Senior Permit (65+)', price: '$10' },
  { value: 'junior', label: 'Junior Permit (Ages 5-13)', price: '$1' }
]

// Generate years from current year minus 5 down to 1900
const generateBirthYears = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear - 5; year >= 1900; year--) {
    years.push(year)
  }
  return years
}

const birthYears = generateBirthYears()

// Generate months and days for date of birth
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

const states = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]

export default function PermitApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PermitApplicationData>({
    resolver: zodResolver(permitApplicationSchema),
    defaultValues: { permitType: 'regular' }
  })

  const selectedPermitType = watch('permitType')
  const selectedPermit = permitTypes.find(p => p.value === selectedPermitType)

  const onSubmit = async (data: PermitApplicationData) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Combine feet and inches into a single height string
      const heightString = `${data.heightFeet}'${data.heightInches}"`
      
      // Create the data object with combined height, excluding the separate height fields
      const { heightFeet, heightInches, ...restData } = data
      const submitData = {
        ...restData,
        height: heightString
      }

      const response = await fetch('/api/permit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit application')
      }

      const result = await response.json()
      setSubmitSuccess(true)

      // Redirect to payment page with user information
      const amount = selectedPermit?.price.replace('$', '') || '15'
      const params = new URLSearchParams({
        userId: result.userId,
        firstName: result.firstName,
        lastName: result.lastName,
        permitType: result.permitType,
        amount: amount
      })
      window.location.href = `/payment?${params.toString()}`

    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting your application')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'rgb(59, 102, 126)', borderColor: 'rgb(85, 85, 85)' }}>
          <div className="p-10">
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(85, 85, 85)' }}>
                Application Submitted Successfully!
              </h1>
              <p style={{ color: 'rgb(85, 85, 85)' }}>
                Your application has been received and you will be redirected to payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-xl shadow-xl border overflow-hidden" style={{ backgroundColor: 'rgb(59, 102, 126)', borderColor: 'rgb(85, 85, 85)' }}>
        <div className="p-12">
          <div className="bg-white rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(85, 85, 85)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'rgba(18, 62, 45, 0.1)' }}>
                  <span className="font-bold text-sm" style={{ color: 'rgba(18, 62, 45, 0.9)' }}>1</span>
                </div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    id="firstName"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                    style={{ 
                      borderColor: errors.firstName ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    id="lastName"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                    style={{ 
                      borderColor: errors.lastName ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 max-w-md">
                  <div className="flex-1">
                    <select
                      {...register('dateOfBirthMonth', { valueAsNumber: true })}
                      id="dateOfBirthMonth"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: errors.dateOfBirthMonth ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                    >
                      <option value="">Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      {...register('dateOfBirthDay', { valueAsNumber: true })}
                      id="dateOfBirthDay"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: errors.dateOfBirthDay ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                    >
                      <option value="">Day</option>
                      {days.map(day => (
                        <option key={day} value={day}>{day.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      {...register('dateOfBirthYear', { valueAsNumber: true })}
                      id="dateOfBirthYear"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: errors.dateOfBirthYear ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                    >
                      <option value="">Year</option>
                      {birthYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Characteristics Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(85, 85, 85)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'rgba(18, 62, 45, 0.1)' }}>
                  <span className="font-bold text-sm" style={{ color: 'rgba(18, 62, 45, 0.9)' }}>2</span>
                </div>
                Physical Characteristics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    Height <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        {...register('heightFeet', { valueAsNumber: true })}
                        type="number"
                        id="heightFeet"
                        min="1"
                        max="7"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: errors.heightFeet ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="ft."
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        {...register('heightInches', { valueAsNumber: true })}
                        type="number"
                        id="heightInches"
                        min="0"
                        max="12"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: errors.heightInches ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="in."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="sex" className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    Sex <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('sex')}
                    id="sex"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                    style={{ 
                      borderColor: errors.sex ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                  >
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="eyeColor" className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    Eye Color <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('eyeColor')}
                    id="eyeColor"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                    style={{ 
                      borderColor: errors.eyeColor ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                  >
                    <option value="">Select eye color</option>
                    {eyeColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(85, 85, 85)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'rgba(18, 62, 45, 0.1)' }}>
                  <span className="font-bold text-sm" style={{ color: 'rgba(18, 62, 45, 0.9)' }}>3</span>
                </div>
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                    style={{ 
                      borderColor: errors.email ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('phoneNumber')}
                    type="tel"
                    id="phoneNumber"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                    style={{ 
                      borderColor: errors.phoneNumber ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4" style={{ color: 'rgb(85, 85, 85)' }}>
                  Mailing Address <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      {...register('addressLine1')}
                      type="text"
                      id="addressLine1"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: errors.addressLine1 ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="Street address, P.O. box, company name, c/o"
                    />
                  </div>

                  <div>
                    <input
                      {...register('addressLine2')}
                      type="text"
                      id="addressLine2"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: errors.addressLine2 ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        {...register('town')}
                        type="text"
                        id="town"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: errors.town ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="Town or city"
                      />
                    </div>

                    <div>
                      <select
                        {...register('state')}
                        id="state"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: errors.state ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        {...register('zipCode')}
                        type="text"
                        id="zipCode"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: errors.zipCode ? 'rgb(239, 68, 68)' : 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Permit Type Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(85, 85, 85)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'rgba(18, 62, 45, 0.1)' }}>
                  <span className="font-bold text-sm" style={{ color: 'rgba(18, 62, 45, 0.9)' }}>4</span>
                </div>
                Permit Type
              </h2>
              <div className="space-y-2">
                  {permitTypes.map((permit) => (
                    <label key={permit.value} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer" style={{ borderColor: 'rgb(85, 85, 85)' }}>
                      <input
                        {...register('permitType')}
                        type="radio"
                        value={permit.value}
                        defaultChecked={permit.value === 'regular'}
                        className="h-4 w-4 focus:ring-2 focus:border-transparent"
                        style={{ 
                          accentColor: 'rgba(18, 62, 45, 0.9)'
                        }}
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium" style={{ color: 'rgb(85, 85, 85)' }}>{permit.label}</div>
                        <div className="text-sm" style={{ color: 'rgb(85, 85, 85)' }}>{permit.price}</div>
                      </div>
                    </label>
                  ))}
                </div>

              <div className="space-y-4 mt-6">
                <div className={`flex items-start ${errors.termsAccepted ? 'ring-2 ring-red-500 rounded p-2' : ''}`}>
                  <input
                    {...register('termsAccepted')}
                    type="checkbox"
                    id="termsAccepted"
                    className="h-4 w-4 focus:ring-2 focus:border-transparent rounded mt-1"
                    style={{ 
                      accentColor: 'rgba(18, 62, 45, 0.9)'
                    }}
                  />
                  <label htmlFor="termsAccepted" className="ml-3 text-sm" style={{ color: 'rgb(85, 85, 85)' }}>
                    I agree to the <a href="/terms" className="text-blue-600 hover:underline" target="_blank">Terms of Service</a> <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    {...register('communicationsOptIn')}
                    type="checkbox"
                    id="communicationsOptIn"
                    className="h-4 w-4 focus:ring-2 focus:border-transparent rounded mt-1"
                    style={{ 
                      accentColor: 'rgba(18, 62, 45, 0.9)'
                    }}
                  />
                  <label htmlFor="communicationsOptIn" className="ml-3 text-sm" style={{ color: 'rgb(85, 85, 85)' }}>
                    I would like to receive communications from the Town of Greenwich Shellfish Commission
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-white rounded-lg p-6">
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              <div className="text-center">
                {Object.keys(errors).length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">
                      Please complete all required fields
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white py-4 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  style={{ 
                    backgroundColor: 'rgba(18, 62, 45, 0.9)'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Application...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>

                {selectedPermit && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Total amount due: <span className="font-bold text-lg" style={{ color: 'rgb(59, 102, 126)' }}>{selectedPermit.price}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment will be processed after form submission
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}