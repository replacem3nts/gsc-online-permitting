'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { permitApplicationSchema, type PermitApplicationData } from '@/lib/validations'

const eyeColors = [
  'Brown', 'Blue', 'Green', 'Grey', 'Hazel'
]

const permitTypes = [
  { value: 'regular', label: 'Regular Permit', price: '$25' },
  { value: 'senior', label: 'Senior Permit (65+)', price: '$15' },
  { value: 'junior', label: 'Junior Permit (Under 16)', price: '$10' }
]

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
      const amount = selectedPermit?.price.replace('$', '') || '25'
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
                      borderColor: 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
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
                      borderColor: 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(85, 85, 85)' }}>
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 max-w-md">
                  <div className="flex-1">
                    <input
                      {...register('dateOfBirthMonth', { valueAsNumber: true })}
                      type="number"
                      id="dateOfBirthMonth"
                      min="1"
                      max="12"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="MM"
                    />
                    {errors.dateOfBirthMonth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirthMonth.message}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      {...register('dateOfBirthDay', { valueAsNumber: true })}
                      type="number"
                      id="dateOfBirthDay"
                      min="1"
                      max="31"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="DD"
                    />
                    {errors.dateOfBirthDay && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirthDay.message}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      {...register('dateOfBirthYear', { valueAsNumber: true })}
                      type="number"
                      id="dateOfBirthYear"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="YYYY"
                    />
                    {errors.dateOfBirthYear && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirthYear.message}</p>
                    )}
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
                          borderColor: 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="ft."
                      />
                      {errors.heightFeet && (
                        <p className="mt-1 text-sm text-red-600">{errors.heightFeet.message}</p>
                      )}
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
                          borderColor: 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="in."
                      />
                      {errors.heightInches && (
                        <p className="mt-1 text-sm text-red-600">{errors.heightInches.message}</p>
                      )}
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
                      borderColor: 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                  >
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>
                  )}
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
                      borderColor: 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                  >
                    <option value="">Select eye color</option>
                    {eyeColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {errors.eyeColor && (
                    <p className="mt-1 text-sm text-red-600">{errors.eyeColor.message}</p>
                  )}
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
                      borderColor: 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
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
                      borderColor: 'rgb(85, 85, 85)', 
                      color: 'rgb(85, 85, 85)'
                    }}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                  )}
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
                        borderColor: 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="Street address, P.O. box, company name, c/o"
                    />
                    {errors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register('addressLine2')}
                      type="text"
                      id="addressLine2"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                      style={{ 
                        borderColor: 'rgb(85, 85, 85)', 
                        color: 'rgb(85, 85, 85)'
                      }}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                    {errors.addressLine2 && (
                      <p className="mt-1 text-sm text-red-600">{errors.addressLine2.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        {...register('town')}
                        type="text"
                        id="town"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="Town or city"
                      />
                      {errors.town && (
                        <p className="mt-1 text-sm text-red-600">{errors.town.message}</p>
                      )}
                    </div>

                    <div>
                      <select
                        {...register('state')}
                        id="state"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: 'rgb(85, 85, 85)', 
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
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register('zipCode')}
                        type="text"
                        id="zipCode"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent h-10"
                        style={{ 
                          borderColor: 'rgb(85, 85, 85)', 
                          color: 'rgb(85, 85, 85)'
                        }}
                        placeholder="Zip Code"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                      )}
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
                Permit Type & Terms
              </h2>
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'rgb(85, 85, 85)' }}>
                  Permit Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {permitTypes.map((permit) => (
                    <label key={permit.value} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer" style={{ borderColor: 'rgb(85, 85, 85)' }}>
                      <input
                        {...register('permitType')}
                        type="radio"
                        value={permit.value}
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
                {errors.permitType && (
                  <p className="mt-1 text-sm text-red-600">{errors.permitType.message}</p>
                )}
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-start">
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
                {errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
                )}

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
                      Total amount due: <span className="font-bold text-lg text-blue-600">{selectedPermit.price}</span>
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