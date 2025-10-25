import { NextRequest, NextResponse } from 'next/server'
import { permitApplicationApiSchema } from '../../../lib/validations'
import { prisma } from '../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = permitApplicationApiSchema.parse(body)
    
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email address already exists' },
        { status: 400 }
      )
    }
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        height: validatedData.height,
        dateOfBirthMonth: validatedData.dateOfBirthMonth,
        dateOfBirthDay: validatedData.dateOfBirthDay,
        dateOfBirthYear: validatedData.dateOfBirthYear,
        sex: validatedData.sex,
        eyeColor: validatedData.eyeColor,
        addressLine1: validatedData.addressLine1,
        addressLine2: validatedData.addressLine2,
        town: validatedData.town,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        permitType: validatedData.permitType,
        termsAccepted: validatedData.termsAccepted,
        communicationsOptIn: validatedData.communicationsOptIn,
        paymentCompleted: false
      }
    })
    
    return NextResponse.json({
      message: 'Application submitted successfully',
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      permitType: user.permitType
    })
    
  } catch (error) {
    console.error('Error submitting permit application:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Invalid form data', errors: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
